"use client";

import { useMemo, useState } from "react";
import { buildReport } from "@/domain/eligibility/engine";
import { projectToRetirement } from "@/domain/eligibility/projection";
import type { Profile } from "@/domain/profile/types";

/**
 * Anticipe les droits "une fois à la retraite", quand les revenus chutent.
 * La personne peut, en option, indiquer le montant estimé de sa future
 * retraite pour affiner. Tout est présenté comme une projection.
 */
export function AnticipationPanel({
  profile,
  currentActiveIds,
}: {
  profile: Profile;
  currentActiveIds: ReadonlySet<string>;
}) {
  const [pensionInput, setPensionInput] = useState("");
  const [pension, setPension] = useState<number | undefined>(undefined);

  const newlyOpened = useMemo(() => {
    const report = buildReport(projectToRetirement(profile, pension));
    return report.results.filter(
      (r) =>
        (r.status === "eligible" || r.status === "to_check") && !currentActiveIds.has(r.aid.id),
    );
  }, [profile, pension, currentActiveIds]);

  function applyPension() {
    const value = Number(pensionInput.replace(",", "."));
    setPension(Number.isFinite(value) && value >= 0 ? value : undefined);
  }

  return (
    <section className="mt-10 rounded-2xl border-2 border-brand bg-brand-light p-6">
      <h2 className="text-2xl font-bold text-brand-dark">Et une fois à la retraite ?</h2>
      <p className="mt-2 text-foreground">
        Au passage à la retraite, vos revenus baissent souvent d&apos;un coup. C&apos;est
        justement le moment où de nouvelles aides s&apos;ouvrent, parce qu&apos;elles dépendent de
        vos ressources.
      </p>

      <div className="mt-4 rounded-xl bg-card p-4">
        <label htmlFor="future-pension" className="block font-medium text-foreground">
          Avez-vous une idée du montant de votre future retraite ? (facultatif)
        </label>
        <p className="mt-1 text-muted">
          Une estimation suffit. Plus c&apos;est précis, plus l&apos;anticipation est juste.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <input
            id="future-pension"
            inputMode="numeric"
            value={pensionInput}
            onChange={(e) => setPensionInput(e.target.value)}
            placeholder="ex. 1 100"
            aria-describedby="future-pension-unit"
            className="w-40 rounded-lg border-2 border-border bg-card p-3 text-lg focus-visible:border-brand"
          />
          <span id="future-pension-unit" className="text-muted">
            € / mois
          </span>
          <button
            type="button"
            onClick={applyPension}
            className="rounded-lg bg-brand px-5 py-3 font-semibold text-white transition hover:bg-brand-dark active:translate-y-px"
          >
            Mettre à jour
          </button>
        </div>
      </div>

      <div className="mt-5" aria-live="polite">
        {newlyOpened.length > 0 ? (
          <>
            <p className="font-semibold text-foreground">
              Une fois à la retraite, vous pourriez aussi avoir droit à :
            </p>
            <ul className="mt-3 space-y-3">
              {newlyOpened.map((r) => (
                <li key={r.aid.id} className="rounded-xl border border-border bg-card p-4">
                  <p className="font-semibold text-foreground">{r.aid.name}</p>
                  <p className="mt-1 text-foreground">{r.aid.valueStatement}</p>
                  <p className="mt-1 text-base text-muted">
                    À demander le moment venu, auprès de : {r.aid.howToApply.organism}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-base text-muted">
              Projection indicative, à confirmer une fois vos revenus de retraité connus.
            </p>
          </>
        ) : (
          <p className="text-foreground">
            D&apos;après ces réponses, les aides correspondantes apparaissent déjà ci-dessus. Pensez
            à refaire le point au moment de votre départ à la retraite.
          </p>
        )}
      </div>
    </section>
  );
}
