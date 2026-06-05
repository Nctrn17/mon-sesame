"use client";

import { useEffect, useId, useRef, useState } from "react";
import { searchCommunes } from "@/domain/geo/communes";
import type { Commune } from "@/domain/geo/types";

interface Props {
  readonly selected?: Commune;
  readonly onSelect: (commune: Commune) => void;
  /** Id d'un élément (ex. le titre de la question) servant de label au champ. */
  readonly labelledById?: string;
}

function label(c: Commune): string {
  const cp = c.codesPostaux[0] ? `${c.codesPostaux[0]} ` : "";
  return `${cp}${c.nom} (${c.codeDepartement})`;
}

export function CommuneAutocomplete({ selected, onSelect, labelledById }: Props) {
  const [query, setQuery] = useState(selected ? label(selected) : "");
  const [results, setResults] = useState<Commune[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const skipNextSearch = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  useEffect(() => {
    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }
    if (query.trim().length < 2) {
      // L'effacement de l'état est géré dans onChange, pas dans l'effet
      // (évite un setState synchrone dans le corps de l'effet).
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);
      searchCommunes(query, controller.signal)
        .then((r) => {
          setResults(r);
          setOpen(true);
          setActiveIndex(-1);
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setResults([]);
            setOpen(false);
            setError("Recherche indisponible. Réessayez.");
          }
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  function onChange(value: string) {
    setQuery(value);
    setError(null);
    if (value.trim().length < 2) {
      setResults([]);
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  function choose(c: Commune) {
    skipNextSearch.current = true;
    onSelect(c);
    setQuery(label(c));
    setResults([]);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = results[activeIndex] ?? results[0];
      if (pick) choose(pick);
    }
  }

  const activeDescendant = activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined;

  return (
    <div className="relative mt-6">
      <input
        ref={inputRef}
        type="text"
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeDescendant}
        aria-label={labelledById ? undefined : "Nom ou code postal de votre commune"}
        aria-labelledby={labelledById}
        placeholder="Nom de la commune ou code postal"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="w-full rounded-xl border-2 border-border bg-card p-4 text-lg focus-visible:border-brand"
      />

      {/* Annonce du nombre de résultats aux lecteurs d'écran (toujours dans le DOM) */}
      <p className="sr-only" role="status" aria-live="polite">
        {loading
          ? "Recherche en cours"
          : open && results.length > 0
            ? `${results.length} commune${results.length > 1 ? "s" : ""} trouvée${results.length > 1 ? "s" : ""}`
            : ""}
      </p>
      {loading ? (
        <p aria-hidden className="mt-2 text-muted">
          Recherche en cours...
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-2 text-warn">
          {error}
        </p>
      ) : null}

      {open && results.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-10 mt-2 max-h-72 w-full overflow-auto rounded-xl border-2 border-border bg-card shadow-lg"
        >
          {results.map((c, i) => (
            <li
              key={c.code}
              id={`${listId}-option-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              tabIndex={-1}
              onClick={() => choose(c)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`cursor-pointer px-4 py-3 text-lg ${
                i === activeIndex ? "bg-brand-light" : "hover:bg-brand-light"
              }`}
            >
              {label(c)}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
