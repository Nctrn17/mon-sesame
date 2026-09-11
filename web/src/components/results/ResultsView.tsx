"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { SeedShape } from "@/components/brand/SeedShape";
import { SimHeader } from "@/components/wizard/SimHeader";
import { THEME_LABELS } from "@/domain/aids/themes";
import { buildReport } from "@/domain/eligibility/engine";
import { countItems, groupResults, type ThemeGroup } from "@/domain/eligibility/grouping";
import type { AidResult } from "@/domain/eligibility/types";
import type { Profile } from "@/domain/profile/types";
import { AidDetail } from "./AidDetail";
import { AnticipationPanel } from "./AnticipationPanel";
import { LocalAidsSection } from "./LocalAidsSection";
import { LocalGuichetPanel } from "./LocalGuichetPanel";
import { describeProfile } from "./describeProfile";

interface Props {
  profile: Profile;
  onRestart: () => void;
  /** Revenir au questionnaire en gardant les réponses. */
  onEdit: () => void;
}

export function ResultsView({ profile, onRestart, onEdit }: Props) {
  const report = useMemo(() => buildReport(profile), [profile]);
  const [selected, setSelected] = useState<AidResult | null>(null);
  // Le bloc « Bon à savoir » est replié par défaut ; on garde son état pour
  // qu'il ne se referme pas quand on revient d'une fiche.
  const [goodToKnowOpen, setGoodToKnowOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastRowId = useRef<string | null>(null);

  // Le focus suit l'écran : titre des résultats à l'arrivée, puis retour sur
  // la ligne cliquée quand on referme le détail.
  useEffect(() => {
    if (selected) return;
    const id = lastRowId.current;
    lastRowId.current = null;
    const row = id
      ? containerRef.current?.querySelector<HTMLElement>(`[data-aid-id="${id}"]`)
      : null;
    (row ?? headingRef.current)?.focus();
  }, [selected]);

  const groups = useMemo(() => groupResults(report.results), [report]);
  const { toRequest, toCheck, goodToKnow, other } = groups;
  const activeIds = useMemo(
    () =>
      new Set(
        report.results
          .filter((r) => r.status === "eligible" || r.status === "to_check")
          .map((r) => r.aid.id),
      ),
    [report],
  );
  const mainCount = countItems(toRequest) + countItems(toCheck);
  const goodToKnowCount = countItems(goodToKnow);
  const showAnticipation = profile.retirement === "bientot" || profile.retirement === "actif";

  // Déplie les aides non retenues le temps de l'impression : un <details>
  // fermé ne s'imprime pas, et le bilan papier doit être complet.
  const printReport = () => {
    const closed = Array.from(
      containerRef.current?.querySelectorAll("details:not([open])") ?? [],
    );
    for (const d of closed) d.setAttribute("open", "");
    window.print();
    for (const d of closed) d.removeAttribute("open");
  };

  const open = (r: AidResult, fromRow = false) => {
    lastRowId.current = fromRow ? r.aid.id : null;
    setSelected(r);
    window.scrollTo({ top: 0 });
  };

  if (selected) {
    return <AidDetail result={selected} onBack={() => setSelected(null)} />;
  }

  if (mainCount === 0 && goodToKnowCount === 0) {
    return <EmptyResults onEdit={onEdit} onRestart={onRestart} headingRef={headingRef} />;
  }

  return (
    <div ref={containerRef} className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <SeedShape
        className="hidden lg:block"
        wrapper={{ right: -140, top: -330, width: 900, height: 900 }}
        shape={{ left: 230, top: 100, width: 440, height: 700 }}
        rotate={-24}
        blur={18}
        opacity={0.55}
        variant="open"
        grain2={false}
        grainOpacity={0.8}
      />
      <SeedShape
        className="lg:hidden"
        wrapper={{ right: -260, top: -380, width: 520, height: 560 }}
        shape={{ left: 130, top: 50, width: 270, height: 430 }}
        rotate={-24}
        blur={14}
        opacity={0.55}
        variant="open"
        grain2={false}
      />
      <SimHeader>
        <button type="button" onClick={printReport} className="pill pill-white px-5 py-2.5">
          Imprimer
        </button>
        <button type="button" onClick={onRestart} className="pill pill-white hidden px-5 py-2.5 sm:inline-flex">
          Recommencer
        </button>
      </SimHeader>

      <main
        id="contenu"
        className="relative grid items-start gap-12 px-[22px] pb-16 pt-6 sm:px-12 sm:pb-24 sm:pt-16 lg:grid-cols-[1fr_320px] lg:gap-[72px] mx-auto w-full max-w-[1200px]"
      >
        <div>
          <p className="text-[15px] text-muted sm:text-base">D&apos;après vos réponses</p>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mt-2.5 font-serif text-[40px] leading-[1.02] tracking-[-0.02em] outline-none sm:mt-4 sm:text-[64px]"
          >
            {mainCount > 0 ? (
              <>
                Voici ce qui
                <br />
                vous concerne.
              </>
            ) : (
              <>
                Pas de droit majeur,
                <br />
                mais des coups de pouce.
              </>
            )}
          </h1>
          <p className="mt-3 max-w-[600px] text-base leading-[1.5] text-muted sm:mt-5 sm:text-[19px] sm:leading-[1.55]">
            Ce sont des estimations, pas une décision : chaque organisme tranche. Aucune de ces
            aides n&apos;est attribuée sans demande.
          </p>
          <p className="hidden print:block mt-2 text-base text-muted">
            Bilan Mon sésame du {new Date(report.generatedAt).toLocaleDateString("fr-FR")}.
          </p>

          {countItems(toRequest) > 0 ? (
            <ThemedBlock
              title="À demander"
              dot="dot-warm"
              groups={toRequest}
              verb="À demander à"
              onOpen={open}
              className="mt-8 sm:mt-14"
            />
          ) : null}

          {countItems(toCheck) > 0 ? (
            <ThemedBlock
              title="À vérifier avec quelqu'un"
              dot="dot-check"
              groups={toCheck}
              verb="À voir avec"
              onOpen={open}
              className="mt-7 sm:mt-12"
            />
          ) : null}

          {goodToKnowCount > 0 ? (
            <details
              className="group mt-9 sm:mt-14"
              open={goodToKnowOpen}
              onToggle={(e) => setGoodToKnowOpen(e.currentTarget.open)}
            >
              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2.5 text-lg font-medium sm:gap-3 sm:text-[22px]">
                  <span aria-hidden className="dot" />
                  Bon à savoir
                  <span className="font-normal text-muted">({goodToKnowCount})</span>
                  <span
                    aria-hidden
                    className="ml-1 inline-block text-muted transition group-open:rotate-90 print:hidden"
                  >
                    ›
                  </span>
                </span>
                <span className="mt-1.5 block text-[15px] leading-[1.5] text-muted sm:text-[17px]">
                  Des services gratuits ou des petites réductions, à garder sous la main.
                </span>
              </summary>
              <CompactBlock groups={goodToKnow} onOpen={open} />
            </details>
          ) : null}

          <LocalAidsSection commune={profile.commune} />

          {other.length > 0 ? (
            <details className="group mt-7 print:mt-12">
              <summary className="link-sienna inline-block cursor-pointer list-none text-[17px] text-foreground [&::-webkit-details-marker]:hidden print:hidden">
                Voir les aides qui ne vous concernent pas
                <span aria-hidden className="ml-1.5 inline-block transition group-open:rotate-90">
                  ›
                </span>
              </summary>
              <OtherList items={other} onOpen={open} />
            </details>
          ) : null}
        </div>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-6">
          <div className="rounded-[18px] border border-border bg-surface p-[26px]">
            <p className="text-[15px] text-muted">Votre situation</p>
            <p className="mt-2.5 text-[17px] leading-[1.6]">{describeProfile(profile)}</p>
            <button
              type="button"
              onClick={onEdit}
              className="link-sienna print:hidden mt-3 text-base text-foreground"
            >
              Modifier une réponse
            </button>
          </div>
          <LocalGuichetPanel commune={profile.commune} />
          {showAnticipation ? (
            <AnticipationPanel profile={profile} currentActiveIds={activeIds} />
          ) : null}
          <p className="px-1.5 text-base leading-[1.6] text-muted">
            Gardez ces résultats : imprimez-les ou faites-les lire à un proche. Rien n&apos;est
            enregistré ici.
          </p>
          <button
            type="button"
            onClick={onRestart}
            className="pill pill-white print:hidden self-start px-5 py-2.5 text-base sm:hidden"
          >
            Recommencer
          </button>
        </aside>
      </main>
    </div>
  );
}

function ThemedBlock({
  title,
  dot,
  groups,
  verb,
  onOpen,
  className,
}: {
  title: string;
  dot: string;
  groups: readonly ThemeGroup[];
  verb?: string;
  onOpen: (r: AidResult, fromRow: boolean) => void;
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="flex items-center gap-2.5 text-lg font-medium sm:gap-3 sm:text-[22px]">
        <span aria-hidden className={`dot ${dot}`} />
        {title}
        <span className="font-normal text-muted">({countItems(groups)})</span>
      </h2>
      {groups.map((g) => (
        <div key={g.theme} className="mt-5 sm:mt-7">
          <h3 className="text-[15px] font-medium uppercase tracking-[0.06em] text-muted sm:text-base">
            {THEME_LABELS[g.theme]}
          </h3>
          <ul className="mt-1.5 flex flex-col sm:mt-2.5">
            {g.items.map((r, i) => (
              <li
                key={r.aid.id}
                className={`border-t border-border ${i === g.items.length - 1 ? "border-b" : ""}`}
              >
                <button
                  type="button"
                  data-aid-id={r.aid.id}
                  onClick={() => onOpen(r, true)}
                  aria-label={`${r.aid.name} : voir le détail`}
                  className="-mx-3 grid w-[calc(100%+24px)] grid-cols-[1fr_auto] items-center gap-3 rounded-lg px-3 py-3.5 text-left transition hover:bg-hover sm:gap-6 sm:py-[22px]"
                >
                  <span>
                    <span className="block font-serif text-[22px] leading-tight tracking-[-0.01em] text-foreground sm:text-[28px]">
                      {r.aid.name}
                    </span>
                    <span className="mt-1 block text-[15px] leading-[1.5] text-muted sm:mt-1.5 sm:text-[17px]">
                      <span className="hidden sm:inline">{r.aid.valueStatement} </span>
                      {verb ? (
                        <>
                          {verb} : {r.aid.howToApply.organism}.
                        </>
                      ) : null}
                    </span>
                  </span>
                  <span aria-hidden className="text-xl text-muted sm:text-[22px]">
                    ›
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

/** Liste compacte : le nom seulement, le détail reste au clic. */
function CompactBlock({
  groups,
  onOpen,
}: {
  groups: readonly ThemeGroup[];
  onOpen: (r: AidResult, fromRow: boolean) => void;
}) {
  return (
    <div className="mt-4 sm:mt-6">
      {groups.map((g) => (
        <div key={g.theme} className="mt-4 first:mt-0 sm:mt-5">
          <h3 className="text-[15px] font-medium uppercase tracking-[0.06em] text-muted sm:text-base">
            {THEME_LABELS[g.theme]}
          </h3>
          <ul className="mt-1 flex flex-col">
            {g.items.map((r) => (
              <li key={r.aid.id}>
                <button
                  type="button"
                  data-aid-id={r.aid.id}
                  onClick={() => onOpen(r, true)}
                  aria-label={`${r.aid.name} : voir le détail`}
                  className="-mx-3 flex w-[calc(100%+24px)] items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[19px] leading-snug text-foreground transition hover:bg-hover sm:text-[21px]"
                >
                  <span>
                    {r.aid.name}
                    {r.status === "to_check" ? (
                      <span className="ml-2 text-[14px] text-muted sm:text-[15px]">à vérifier</span>
                    ) : null}
                  </span>
                  <span aria-hidden className="text-lg text-muted">
                    ›
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function OtherList({
  items,
  onOpen,
}: {
  items: readonly AidResult[];
  onOpen: (r: AidResult, fromRow: boolean) => void;
}) {
  return (
    <section className="mt-6">
      <h2 className="flex items-center gap-2.5 text-lg font-medium sm:gap-3 sm:text-[22px]">
        <span aria-hidden className="dot dot-off" />
        Ne vous concernent pas a priori
      </h2>
      <ul className="mt-2 flex flex-col">
        {items.map((r) => (
          <li key={r.aid.id}>
            <button
              type="button"
              data-aid-id={r.aid.id}
              onClick={() => onOpen(r, true)}
              aria-label={`${r.aid.name} : voir le détail`}
              className="-mx-3 flex w-[calc(100%+24px)] items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[19px] leading-snug text-muted transition hover:bg-hover sm:text-[21px]"
            >
              <span>{r.aid.name}</span>
              <span aria-hidden className="text-lg">›</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EmptyResults({
  onEdit,
  onRestart,
  headingRef,
}: {
  onEdit: () => void;
  onRestart: () => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <SeedShape
        className="hidden lg:block"
        wrapper={{ right: -140, top: -330, width: 900, height: 900 }}
        shape={{ left: 230, top: 100, width: 440, height: 700 }}
        rotate={-24}
        blur={22}
        opacity={0.35}
        grain2={false}
        grainOpacity={0}
      />
      <SimHeader>
        <button type="button" onClick={onRestart} className="pill pill-white px-5 py-2.5">
          Recommencer
        </button>
      </SimHeader>
      <main id="contenu" className="relative mx-auto w-full max-w-[1200px] px-[22px] pb-16 pt-6 sm:px-12 sm:pb-24 sm:pt-16">
        <div className="max-w-[760px]">
        <p className="text-base text-muted">D&apos;après vos réponses</p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 font-serif text-[40px] leading-[1.05] tracking-[-0.02em] outline-none sm:text-[60px]"
        >
          Aucune aide ne ressort pour l&apos;instant.
        </h1>
        <p className="mt-5 text-lg leading-[1.55] text-body sm:text-xl">
          Cela peut changer : au départ à la retraite, quand les revenus baissent, ou après un
          changement de situation. Beaucoup d&apos;aides s&apos;ouvrent à ce moment-là.
        </p>
        <div className="mt-9 flex flex-wrap gap-3.5">
          <button type="button" onClick={onEdit} className="pill pill-honey px-7 py-4 text-lg">
            Revoir mes réponses
          </button>
          <Link href="/simulateur?pour=proche" className="pill pill-white px-7 py-4 text-lg">
            Faire le point pour un proche
          </Link>
        </div>
        <p className="mt-10 max-w-[600px] text-[17px] leading-[1.6] text-muted">
          Si votre situation est particulière (handicap, veuvage récent, difficultés à payer une
          facture), un conseiller France Services ou le CCAS de votre mairie peut regarder avec
          vous, gratuitement.
        </p>
        </div>
      </main>
    </div>
  );
}
