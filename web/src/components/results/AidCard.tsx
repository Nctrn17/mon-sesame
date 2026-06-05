import type { AidCategory, AidImpact } from "@/domain/aids/types";
import type { AidResult, EligibilityStatus } from "@/domain/eligibility/types";
import type { Profile } from "@/domain/profile/types";
import { AspaPrecision } from "./AspaPrecision";

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

const IMPACT: Record<AidImpact, { label: string; className: string }> = {
  eleve: { label: "Aide importante", className: "bg-money-light text-money" },
  moyen: { label: "Aide utile", className: "bg-brand-light text-brand-dark" },
  coup_de_pouce: { label: "Coup de pouce", className: "bg-border text-foreground" },
};

function statusBadge(status: EligibilityStatus): { label: string; className: string } {
  switch (status) {
    case "eligible":
      return { label: "Vous y avez droit", className: "bg-money text-white" };
    case "to_check":
      return { label: "À confirmer ensemble", className: "bg-warn-light text-warn" };
    case "not_eligible":
      return { label: "Non concerné", className: "bg-border text-muted" };
    case "unknown":
      return { label: "À préciser", className: "bg-border text-muted" };
  }
}

export function AidCard({ result, profile }: { result: AidResult; profile: Profile }) {
  const { aid } = result;
  const badge = statusBadge(result.status);
  const impact = IMPACT[aid.impact];
  const showHowTo = result.status === "eligible" || result.status === "to_check";

  return (
    <article className="rounded-2xl border-2 border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${badge.className}`}>
          {badge.label}
        </span>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${impact.className}`}>
          {impact.label}
        </span>
        <span className="rounded-full bg-brand-light px-3 py-1 text-sm font-medium text-brand-dark">
          {CATEGORY_LABELS[aid.category]}
        </span>
      </div>

      <h3 className="mt-3 text-xl font-semibold text-foreground">{aid.name}</h3>
      <p className="mt-1 text-lg font-medium text-foreground">{aid.valueStatement}</p>
      <p className="mt-2 text-muted">{aid.description}</p>

      {result.explanation.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {result.explanation.map((line, i) => (
            <li key={i} className="flex gap-2 text-foreground">
              <span aria-hidden className="text-money">
                ✓
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {result.missingInfo && result.missingInfo.length > 0 ? (
        <div className="mt-4 rounded-xl bg-warn-light p-3 text-foreground">
          <p className="font-medium text-warn">Pour confirmer, il reste à savoir :</p>
          <ul className="mt-1 list-disc pl-5">
            {result.missingInfo.map((info, i) => (
              <li key={i}>{info}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {showHowTo ? (
        <div className="mt-5 rounded-xl border-2 border-brand bg-brand-light p-4">
          <p className="text-lg font-semibold text-brand-dark">À faire</p>
          <p className="mt-2 text-foreground">
            <span className="font-medium">Qui contacter : </span>
            {aid.howToApply.organism}
          </p>
          {aid.howToApply.steps ? (
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-foreground">
              {aid.howToApply.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          ) : null}
          {aid.howToApply.sentenceToSay ? (
            <p className="mt-3 rounded-lg bg-card p-3 text-foreground">
              <span className="font-medium">À dire ou à écrire : </span>
              <span className="italic">« {aid.howToApply.sentenceToSay} »</span>
            </p>
          ) : null}
          {aid.howToApply.url ? (
            <a
              href={aid.howToApply.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Faire la demande pour ${aid.name} (nouvelle fenêtre)`}
              className="mt-3 inline-block rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark"
            >
              Faire la demande
            </a>
          ) : null}
        </div>
      ) : null}

      {aid.whyOftenMissed ? (
        <p className="mt-4 text-sm text-muted">
          <strong>Pourquoi c&apos;est souvent raté :</strong> {aid.whyOftenMissed}
        </p>
      ) : null}

      {aid.id === "aspa" && showHowTo ? <AspaPrecision profile={profile} /> : null}

      <p className="mt-4 text-xs text-muted">
        Source :{" "}
        <a
          href={aid.source.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Source : ${aid.source.label}, pour ${aid.name} (nouvelle fenêtre)`}
          className="underline"
        >
          {aid.source.label}
        </a>{" "}
        · Vérifié le {new Date(aid.lastVerifiedAt).toLocaleDateString("fr-FR")}
      </p>
    </article>
  );
}
