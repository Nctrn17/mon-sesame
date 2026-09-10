"use client";

import { useEffect, useRef } from "react";
import type { AidCategory } from "@/domain/aids/types";
import type { AidResult } from "@/domain/eligibility/types";
import { SimHeader } from "@/components/wizard/SimHeader";

const CATEGORY_LABELS: Record<AidCategory, string> = {
  minima: "Revenu",
  sante: "Santé",
  autonomie: "Autonomie",
  logement: "Logement",
  transport: "Transport",
  fiscal: "Impôts",
  energie: "Énergie",
  caisse_retraite: "Caisse de retraite",
  veuvage: "Veuvage",
  handicap: "Handicap",
  aidant: "Proche aidant",
  vie_quotidienne: "Vie quotidienne",
  retraite: "Retraite",
};

function statusLabel(status: AidResult["status"]): { label: string; dot: string } {
  switch (status) {
    case "eligible":
      return { label: "À demander", dot: "dot-warm" };
    case "to_check":
      return { label: "À vérifier avec quelqu'un", dot: "dot-check" };
    case "not_eligible":
      return { label: "Ne vous concerne pas a priori", dot: "dot-off" };
    case "unknown":
      return { label: "Il manque une information", dot: "dot-off" };
  }
}

/** Écran « détail d'une aide » : le mot qui ouvre, à qui s'adresser, comment faire. */
export function AidDetail({ result, onBack }: { result: AidResult; onBack: () => void }) {
  const { aid } = result;
  const status = statusLabel(result.status);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const active = result.status === "eligible" || result.status === "to_check";

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SimHeader>
        <button
          type="button"
          onClick={onBack}
          className="text-[17px] text-muted underline underline-offset-4 hover:text-foreground"
        >
          <span aria-hidden>← </span>Retour à mes résultats
        </button>
      </SimHeader>

      <main
        id="contenu"
        className="mx-auto grid w-full max-w-[1120px] flex-1 items-start gap-10 px-[22px] pb-16 pt-6 sm:px-12 sm:pb-24 sm:pt-10 lg:grid-cols-[1fr_360px] lg:gap-[72px]"
      >
        <article>
          <p className="flex items-center gap-2.5 text-base">
            <span aria-hidden className={`dot ${status.dot}`} />
            {status.label} · {CATEGORY_LABELS[aid.category]}
          </p>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mt-4 font-serif text-[40px] leading-[1.05] tracking-[-0.02em] outline-none sm:text-[60px] sm:leading-[1.02]"
          >
            {aid.name}
          </h1>
          <p className="mt-[18px] text-xl leading-[1.5] text-body sm:text-[22px]">{aid.description}</p>

          {result.explanation.length > 0 ? (
            <>
              <h2 className="mt-10 text-[22px] font-medium sm:mt-12">
                {result.status === "eligible" || result.status === "to_check"
                  ? "Pourquoi cela vous concerne"
                  : "Pourquoi cela ne ressort pas"}
              </h2>
              <ul className="mt-3 flex flex-col gap-2.5 text-lg leading-[1.55] text-body">
                {result.explanation.map((line, i) => (
                  <li key={i} className="flex gap-3.5">
                    <span aria-hidden className="text-sienna">
                      —
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {result.missingInfo && result.missingInfo.length > 0 ? (
            <div className="mt-6 rounded-[14px] bg-warn-light px-5 py-4 text-lg text-foreground">
              <p className="font-medium text-warn">Pour confirmer, il reste à savoir :</p>
              <ul className="mt-1 list-disc pl-5">
                {result.missingInfo.map((info, i) => (
                  <li key={i}>{info}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {aid.whyOftenMissed ? (
            <p className="mt-6 text-[17px] leading-[1.55] text-muted">
              <span className="font-medium text-foreground">Pourquoi c&apos;est souvent raté : </span>
              {aid.whyOftenMissed}
            </p>
          ) : null}

          {aid.howToApply.steps && aid.howToApply.steps.length > 0 ? (
            <>
              <h2 className="mt-10 text-[22px] font-medium sm:mt-12">Comment faire</h2>
              <ol className="mt-3 flex flex-col">
                {aid.howToApply.steps.map((s, i, arr) => (
                  <li
                    key={i}
                    className={`grid grid-cols-[44px_1fr] gap-3 border-t border-border py-[18px] text-lg leading-[1.55] sm:grid-cols-[56px_1fr] sm:gap-4 ${
                      i === arr.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <span aria-hidden className="font-serif text-[28px] leading-none text-sienna">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </>
          ) : null}

          <p className="mt-10 text-base text-muted">
            Source :{" "}
            <a
              href={aid.source.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Source : ${aid.source.label}, pour ${aid.name} (nouvelle fenêtre)`}
              className="underline underline-offset-4"
            >
              {aid.source.label}
            </a>{" "}
            · règle vérifiée le {new Date(aid.lastVerifiedAt).toLocaleDateString("fr-FR")}
          </p>
        </article>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-6">
          {active && aid.howToApply.sentenceToSay ? (
            <div className="rounded-[20px] bg-plum p-7 text-background">
              <p className="text-[15px] text-plum-text">Le mot qui ouvre</p>
              <p className="mt-3 font-serif text-[24px] leading-[1.3] sm:text-[26px]">
                « {aid.howToApply.sentenceToSay} »
              </p>
              <p className="mt-3.5 text-[15px] text-plum-text">
                À dire ou à écrire. Vous pouvez aussi le faire lire par un proche.
              </p>
            </div>
          ) : null}
          <div className="rounded-[18px] border border-border bg-surface p-[26px]">
            <p className="text-[15px] text-muted">À qui s&apos;adresser</p>
            <p className="mt-2 text-[19px] font-medium leading-snug">{aid.howToApply.organism}</p>
            <p className="mt-1.5 text-base leading-[1.55] text-muted">Piloté par : {aid.authority}.</p>
            {active && aid.howToApply.url ? (
              <a
                href={aid.howToApply.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Voir le site officiel pour ${aid.name} (nouvelle fenêtre)`}
                className="pill pill-honey mt-3.5 px-[22px] py-3.5 text-[17px]"
              >
                Voir le site officiel
              </a>
            ) : null}
          </div>
        </aside>
      </main>
    </div>
  );
}
