"use client";

import { useEffect, useState } from "react";
import { findLocalServices, type LocalService } from "@/domain/geo/localAides";
import type { Commune } from "@/domain/geo/types";

/**
 * Aides et services locaux de la commune (data·inclusion). Ne s'affiche que
 * s'il y a des résultats (donc rien tant que la clé API n'est pas configurée).
 */
export function LocalAidsSection({ commune }: { commune?: Commune }) {
  const [services, setServices] = useState<LocalService[]>([]);

  useEffect(() => {
    if (!commune) return;
    const controller = new AbortController();
    findLocalServices(commune.code, controller.signal).then((r) => setServices(r.services));
    return () => controller.abort();
  }, [commune]);

  if (services.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="flex items-center gap-3 text-[22px] font-medium">
        <span aria-hidden className="dot dot-check" />
        Près de chez vous
      </h2>
      <p className="mt-2 text-[17px] text-muted">
        Des structures locales qui peuvent vous accompagner dans vos démarches.
      </p>
      <ul className="mt-4 flex flex-col">
        {services.map((s, i) => (
          <li key={i} className={`border-t border-border py-5 ${i === services.length - 1 ? "border-b" : ""}`}>
            <h3 className="font-serif text-2xl">{s.nom}</h3>
            {s.structure ? <p className="text-base text-muted">{s.structure}</p> : null}
            {s.resume ? <p className="mt-2 text-[17px] text-body">{s.resume}</p> : null}
            <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-base">
              {s.telephone ? (
                <a href={`tel:${s.telephone.replace(/\s/g, "")}`} className="link-sienna">
                  {s.telephone}
                </a>
              ) : null}
              {s.lien ? (
                <a
                  href={s.lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`En savoir plus sur ${s.nom} (nouvelle fenêtre)`}
                  className="link-sienna"
                >
                  En savoir plus
                </a>
              ) : null}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
