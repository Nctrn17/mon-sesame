import type { Commune } from "@/domain/geo/types";

/**
 * Profil de l'utilisateur (ou du proche pour qui on remplit).
 *
 * Principe RGPD de minimisation : on privilégie des réponses qualitatives
 * (imposable oui/non, besoin d'aide jamais/parfois/...) plutôt que des
 * montants exacts. Le revenu précis n'est demandé qu'en option, pour un
 * calcul exact via OpenFisca.
 */

export type FillingFor = "self" | "relative";
export type MaritalSituation = "seul" | "couple";

/** Proxy de la condition de ressources, sans montant. */
export type TaxStatus = "imposable" | "non_imposable" | "inconnu";

export type Housing =
  | "proprietaire"
  | "locataire"
  | "heberge"
  | "etablissement";

/** Proxy du GIR (degré d'autonomie), auto-évalué. */
export type AutonomyNeed = "jamais" | "parfois" | "souvent" | "quotidien";

export type RetirementScheme =
  | "general"
  | "agricole"
  | "fonction_publique"
  | "special"
  | "mixte"
  | "inconnu";

/** Où en est la personne par rapport à la retraite (déclencheur de droits). */
export type RetirementStatus = "retraite" | "bientot" | "actif";

export interface Profile {
  readonly fillingFor?: FillingFor;
  /** Date de naissance au format ISO (yyyy-mm-dd). */
  readonly birthDate?: string;
  readonly commune?: Commune;
  readonly maritalSituation?: MaritalSituation;
  readonly recentlyWidowed?: boolean;
  readonly taxStatus?: TaxStatus;
  readonly housing?: Housing;
  readonly autonomy?: AutonomyNeed;
  /** Titulaire AAH ou carte mobilité inclusion (invalidité). */
  readonly disability?: boolean;
  /** Aide régulièrement un proche en perte d'autonomie (demandé quand on remplit pour soi). */
  readonly isCaregiver?: boolean;
  /** Emploie déjà une aide à domicile / téléassistance / service à la personne. */
  readonly usesHomeHelp?: boolean;
  readonly scheme?: RetirementScheme;
  readonly retirement?: RetirementStatus;
  /** Optionnel, opt-in : revenu net mensuel du foyer en euros (calcul exact). */
  readonly monthlyIncome?: number;
  /** Optionnel : montant mensuel estimé de la future retraite (anticipation). */
  readonly expectedPension?: number;
}

/** Met à jour un profil de façon immuable (jamais de mutation en place). */
export function updateProfile(profile: Profile, patch: Partial<Profile>): Profile {
  return { ...profile, ...patch };
}

export const EMPTY_PROFILE: Profile = {};
