import type {
  CommuneCode,
  DepartementCode,
  EpciCode,
  RegionCode,
} from "@/domain/geo/types";

/**
 * Périmètre territorial d'une aide. Ajouter un territoire = ajouter des
 * définitions d'aides avec le bon scope, jamais modifier le moteur.
 */
export type TerritoryScope =
  | { readonly level: "national" }
  | { readonly level: "region"; readonly code: RegionCode }
  | { readonly level: "departement"; readonly code: DepartementCode }
  | { readonly level: "epci"; readonly code: EpciCode }
  | { readonly level: "commune"; readonly code: CommuneCode };

export type AidCategory =
  | "minima"
  | "sante"
  | "autonomie"
  | "logement"
  | "transport"
  | "fiscal"
  | "energie"
  | "caisse_retraite"
  | "veuvage"
  | "handicap"
  | "aidant"
  | "vie_quotidienne"
  | "retraite";

/**
 * Ampleur de l'aide, exprimée qualitativement (jamais un montant trompeur).
 * Sert à hiérarchiser et à présenter toutes les aides sur le même plan.
 */
export type AidImpact = "eleve" | "moyen" | "coup_de_pouce";

export interface AidSource {
  readonly label: string;
  readonly url: string;
}

/**
 * Type de guichet local, au sens de l'Annuaire de l'administration (pivot).
 * Sert à afficher le lieu le plus proche sur la fiche d'une aide.
 */
export type GuichetType =
  | "ccas"
  | "cg"
  | "clic"
  | "cpam"
  | "caf"
  | "sip"
  | "pcb"
  | "france_services"
  | "cicas"
  | "anah"
  | "mjd"
  | "mairie";

export interface AidHowToApply {
  /** Organisme qui instruit la demande (le "bon guichet"). */
  readonly organism: string;
  /** Guichet local à localiser pour la personne (le plus proche de sa commune). */
  readonly guichet?: GuichetType;
  readonly url?: string;
  readonly steps?: readonly string[];
  /** Phrase concrète à dire au guichet ou à écrire. */
  readonly sentenceToSay?: string;
}

export interface Aid {
  readonly id: string;
  readonly name: string;
  readonly shortName?: string;
  readonly category: AidCategory;
  readonly scope: TerritoryScope;
  /** Qui verse / pilote l'aide. */
  readonly authority: string;
  /** Ampleur qualitative (pour hiérarchiser et présenter sans chiffre trompeur). */
  readonly impact: AidImpact;
  /** Phrase "ce que ça vous apporte", concrète et en langage clair. */
  readonly valueStatement: string;
  /** Description en langage clair. */
  readonly description: string;
  /** Pourquoi cette aide est souvent ratée (pédagogie anti non-recours). */
  readonly whyOftenMissed?: string;
  readonly source: AidSource;
  readonly howToApply: AidHowToApply;
  /** Date de dernière vérification du contenu (ISO). Sert à la fraîcheur. */
  readonly lastVerifiedAt: string;
}

/** Une aide = ses métadonnées + sa règle d'évaluation. */
export interface AidDefinition {
  readonly aid: Aid;
  readonly evaluate: import("@/domain/eligibility/types").Evaluator;
}
