"use client";

import { useEffect, useMemo, useRef } from "react";
import { buildReport } from "@/domain/eligibility/engine";
import type { AidResult } from "@/domain/eligibility/types";
import type { Profile } from "@/domain/profile/types";
import { AidCard } from "./AidCard";
import { AnticipationPanel } from "./AnticipationPanel";
import { LocalAidsSection } from "./LocalAidsSection";
import { LocalGuichetPanel } from "./LocalGuichetPanel";
import { PotentialBanner } from "./PotentialBanner";
import { THEME_ORDER, themeByKey, themeKeyForCategory } from "./themes";
import { TopPriorities } from "./TopPriorities";

export function ResultsView({
  profile,
  onRestart,
}: {
  profile: Profile;
  onRestart: () => void;
}) {
  const report = useMemo(() => buildReport(profile), [profile]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Déplie toutes les sections le temps de l'impression : un <details>
  // fermé ne s'imprime pas, et le bilan papier doit être complet.
  const printReport = () => {
    const closed = Array.from(
      containerRef.current?.querySelectorAll("details:not([open])") ?? [],
    );
    for (const d of closed) d.setAttribute("open", "");
    window.print();
    for (const d of closed) d.removeAttribute("open");
  };

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const eligible = report.results.filter((r) => r.status === "eligible");
  const toCheck = report.results.filter((r) => r.status === "to_check");
  const other = report.results.filter(
    (r) => r.status === "not_eligible" || r.status === "unknown",
  );

  // Aides "actives" (à votre portée ou à confirmer), regroupées par thème.
  const active = useMemo(() => [...eligible, ...toCheck], [eligible, toCheck]);

  const groups = useMemo(
    () =>
      THEME_ORDER.map((key) => {
        const items = active.filter((r) => themeKeyForCategory(r.aid.category) === key);
        return {
          theme: themeByKey(key),
          items,
          eligibleCount: items.filter((r) => r.status === "eligible").length,
        };
      }).filter((g) => g.items.length > 0),
    [active],
  );

  const currentActiveIds = useMemo(() => new Set(active.map((r) => r.aid.id)), [active]);
  const showAnticipation = profile.retirement === "bientot" || profile.retirement === "actif";

  const renderCard = (r: AidResult) => <AidCard key={r.aid.id} result={r} profile={profile} />;

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-3xl">
      <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-bold text-foreground outline-none">
        Voici vos droits possibles
      </h1>

      <div className="mt-6">
        <PotentialBanner eligibleCount={eligible.length} toCheckCount={toCheck.length} />
      </div>

      <p className="hidden print:block mt-2 text-muted">
        Bilan Boussole du {new Date(report.generatedAt).toLocaleDateString("fr-FR")}.
      </p>

      <p className="mt-4 text-muted">
        Ces résultats sont des <strong>estimations</strong>, pas un accord. C&apos;est chaque
        organisme qui décide. Pour chaque aide, on vous indique le bon endroit où la demander.
      </p>

      <LocalGuichetPanel commune={profile.commune} />

      <TopPriorities items={eligible.slice(0, 3)} />

      {groups.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-foreground">Le détail par thème</h2>
          <p className="mt-1 text-muted">Dépliez les thèmes qui vous intéressent.</p>
          <div className="mt-4 space-y-3">
            {groups.map((g) => (
              <details
                key={g.theme.key}
                open={g.eligibleCount > 0}
                className="group rounded-2xl border-2 border-border bg-card"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-xl font-semibold text-foreground">
                    <span aria-hidden className="mr-2">
                      {g.theme.icon}
                    </span>
                    {g.theme.label}
                    <span className="ml-2 text-base font-normal text-muted">
                      ({g.eligibleCount > 0 ? `${g.eligibleCount} à votre portée, ` : ""}
                      {g.items.length} au total)
                    </span>
                  </h3>
                  <span
                    aria-hidden
                    className="shrink-0 text-base font-medium text-brand-dark underline print:hidden"
                  >
                    <span className="group-open:hidden">Afficher ▾</span>
                    <span className="hidden group-open:inline">Masquer ▴</span>
                  </span>
                </summary>
                <div className="space-y-4 px-5 pb-5">{g.items.map(renderCard)}</div>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {showAnticipation ? (
        <div className="print:hidden">
          <AnticipationPanel profile={profile} currentActiveIds={currentActiveIds} />
        </div>
      ) : null}

      <LocalAidsSection commune={profile.commune} />

      {other.length > 0 ? (
        <details className="group print:hidden mt-10 rounded-2xl border border-border bg-card p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-foreground [&::-webkit-details-marker]:hidden">
            <span>Aides non retenues pour votre profil ({other.length})</span>
            <span aria-hidden className="shrink-0 text-base font-medium text-brand-dark underline">
              <span className="group-open:hidden">Afficher ▾</span>
              <span className="hidden group-open:inline">Masquer ▴</span>
            </span>
          </summary>
          <div className="mt-4 space-y-4">{other.map(renderCard)}</div>
        </details>
      ) : null}

      <aside className="print:hidden mt-10 rounded-2xl border-2 border-brand bg-brand-light p-6">
        <h2 className="text-xl font-semibold text-brand-dark">Gardez ces résultats près de vous</h2>
        <p className="mt-2 text-foreground">
          Bientôt : créez un compte (facultatif) pour sauvegarder votre bilan et être prévenu(e)
          quand un nouveau droit s&apos;ouvre (départ à la retraite, anniversaire, changement de
          situation). En attendant, vous pouvez imprimer cette page.
        </p>
        <button
          type="button"
          onClick={printReport}
          className="mt-4 rounded-lg border-2 border-brand px-5 py-2.5 font-semibold text-brand-dark transition hover:bg-brand hover:text-white active:translate-y-px"
        >
          Imprimer mon bilan
        </button>
      </aside>

      <div className="print:hidden mt-10">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-lg border-2 border-border px-6 py-3 text-lg font-medium text-foreground transition hover:border-brand active:translate-y-px"
        >
          Recommencer le questionnaire
        </button>
      </div>
    </div>
  );
}
