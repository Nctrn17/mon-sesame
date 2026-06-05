import { CATALOG } from "@/domain/aids/catalog";
import type { AidImpact } from "@/domain/aids/types";
import { ageAt } from "@/domain/profile/age";
import type { Profile } from "@/domain/profile/types";
import { scopeApplies } from "./scope";
import type {
  AidResult,
  EligibilityReport,
  EligibilityStatus,
  EvalContext,
} from "./types";

const STATUS_ORDER: Record<EligibilityStatus, number> = {
  eligible: 0,
  to_check: 1,
  unknown: 2,
  not_eligible: 3,
};

// On hiérarchise par importance de l'aide, pas par montant (souvent inconnu),
// pour faire remonter d'abord les droits les plus précieux (ASPA, santé...).
const IMPACT_ORDER: Record<AidImpact, number> = {
  eleve: 0,
  moyen: 1,
  coup_de_pouce: 2,
};

/**
 * Construit le bilan d'éligibilité d'un profil sur tout le catalogue
 * applicable à sa commune. Fonction pure (date de référence injectable).
 */
export function buildReport(
  profile: Profile,
  referenceDate: Date = new Date(),
): EligibilityReport {
  const age = profile.birthDate ? ageAt(profile.birthDate, referenceDate) : null;
  const ctx: EvalContext = { profile, age, referenceDate };

  const results: AidResult[] = CATALOG.filter((def) =>
    scopeApplies(def.aid.scope, profile.commune),
  )
    .map((def) => ({ aid: def.aid, ...def.evaluate(ctx) }))
    .sort(compareResults);

  const totalAnnualPotential = results
    .filter((r) => r.status === "eligible")
    .reduce((sum, r) => sum + (r.estimatedAnnualAmount ?? 0), 0);

  // Comme le potentiel annuel, on ne somme le rétroactif que pour les aides
  // "éligibles", pour éviter tout double comptage futur via un statut "à vérifier".
  const totalRetroactivePotential = results
    .filter((r) => r.status === "eligible")
    .reduce((sum, r) => sum + (r.retroactiveEstimate ?? 0), 0);

  return {
    results,
    totalAnnualPotential,
    totalRetroactivePotential,
    generatedAt: referenceDate.toISOString(),
  };
}

function compareResults(a: AidResult, b: AidResult): number {
  const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
  if (byStatus !== 0) return byStatus;
  const byImpact = IMPACT_ORDER[a.aid.impact] - IMPACT_ORDER[b.aid.impact];
  if (byImpact !== 0) return byImpact;
  return a.aid.name.localeCompare(b.aid.name, "fr");
}
