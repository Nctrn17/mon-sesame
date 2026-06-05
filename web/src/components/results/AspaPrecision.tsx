"use client";

import { useState } from "react";
import { formatEuros } from "@/domain/aids/baremes";
import { computeAspaExact } from "@/domain/eligibility/openfisca/client";
import type { Profile } from "@/domain/profile/types";

/**
 * Calcul exact de l'ASPA via OpenFisca (couche nationale). Le revenu n'est
 * demandé qu'ici, en option, et n'est jamais conservé. Si le service
 * OpenFisca n'est pas joignable, on l'explique et l'estimation reste valable.
 */
export function AspaPrecision({ profile }: { profile: Profile }) {
  const [income, setIncome] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function calculate() {
    const monthly = Number(income.replace(",", "."));
    if (!profile.birthDate || !Number.isFinite(monthly) || monthly < 0) {
      setIsError(true);
      setMessage("Indiquez un revenu mensuel valide (en euros).");
      return;
    }
    setLoading(true);
    setIsError(false);
    setMessage("");
    try {
      const result = await computeAspaExact({
        birthDate: profile.birthDate,
        monthlyIncome: monthly,
        couple: profile.maritalSituation === "couple",
      });
      if (result.available) {
        setMessage(
          result.annualAmount > 0
            ? `Montant ASPA estimé : ${formatEuros(result.annualAmount)} / an (environ ${formatEuros(
                Math.round(result.annualAmount / 12),
              )} / mois).`
            : "Avec ce revenu, vos ressources atteignent déjà le plafond : l'ASPA serait proche de zéro.",
        );
      } else {
        setMessage(
          "Le calcul exact n'est pas disponible pour le moment. L'estimation ci-dessus reste valable ; confirmez le montant auprès de votre caisse de retraite.",
        );
      }
    } catch {
      setIsError(true);
      setMessage("Une erreur est survenue. Réessayez dans un instant.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-border bg-background p-4">
      <p className="font-medium text-foreground">Calculer un montant exact (facultatif)</p>
      <p className="mt-1 text-muted">
        Indiquez le revenu net mensuel de votre foyer. Cette information sert au calcul et
        n&apos;est pas conservée.
      </p>

      <div className="mt-3">
        <label htmlFor="aspa-income" className="block font-medium text-foreground">
          Revenu net mensuel du foyer
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <input
            id="aspa-income"
            inputMode="numeric"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="ex. 850"
            aria-describedby="aspa-income-unit"
            className="w-40 rounded-lg border-2 border-border bg-card p-3 text-lg focus-visible:border-brand"
          />
          <span id="aspa-income-unit" className="text-muted">
            € / mois
          </span>
          <button
            type="button"
            onClick={() => {
              void calculate();
            }}
            disabled={loading}
            className="rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {loading ? "Calcul..." : "Calculer"}
          </button>
        </div>
      </div>

      <p
        className="mt-3 text-foreground"
        role={isError ? "alert" : "status"}
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </p>
    </div>
  );
}
