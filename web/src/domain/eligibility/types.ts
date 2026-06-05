import type { Aid } from "@/domain/aids/types";
import type { Profile } from "@/domain/profile/types";

export type EligibilityStatus =
  | "eligible" // conditions a priori remplies
  | "to_check" // probable mais il manque une info ou ça dépend du guichet
  | "not_eligible" // une condition bloquante n'est pas remplie
  | "unknown"; // pas assez d'information pour se prononcer

/** Contexte d'évaluation dérivé du profil (calculs faits une seule fois). */
export interface EvalContext {
  readonly profile: Profile;
  readonly age: number | null;
  readonly referenceDate: Date;
}

/** Ce que renvoie la règle d'une aide, avant qu'on y rattache l'aide. */
export interface AidVerdict {
  readonly status: EligibilityStatus;
  /** Montant annuel estimé (euros/an), si calculable. */
  readonly estimatedAnnualAmount?: number;
  /** Libellé lisible du montant, ex. "≈ 900 € / an". */
  readonly estimatedAmountLabel?: string;
  /**
   * Manque à gagner passé estimé (euros) : économies/aides non perçues
   * depuis l'ouverture probable du droit. Affiché comme ordre de grandeur,
   * jamais comme une somme récupérable garantie.
   */
  readonly retroactiveEstimate?: number;
  /** "Pourquoi vous y avez (probablement) droit", en langage clair. */
  readonly explanation: readonly string[];
  /** Informations manquantes pour confirmer (statut "à vérifier"). */
  readonly missingInfo?: readonly string[];
}

export type Evaluator = (ctx: EvalContext) => AidVerdict;

export interface AidResult extends AidVerdict {
  readonly aid: Aid;
}

export interface EligibilityReport {
  readonly results: readonly AidResult[];
  /** Somme des montants annuels estimés des aides "éligibles". */
  readonly totalAnnualPotential: number;
  /** Somme des manques à gagner passés estimés. */
  readonly totalRetroactivePotential: number;
  readonly generatedAt: string;
}
