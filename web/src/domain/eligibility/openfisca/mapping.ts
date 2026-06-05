/**
 * Construction d'une "situation" OpenFisca-France pour le calcul exact de
 * l'ASPA. C'est la couche nationale de l'architecture hybride : OpenFisca
 * (maintenu et revalorisé par l'administration) fournit le montant exact,
 * tandis que Publicodes / nos règles couvrent le local et l'orchestration.
 *
 * NB : mapping volontairement prudent et commenté. Il sera affiné au fil de
 * l'intégration ; le revenu est traité comme une pension de retraite.
 */

export interface AspaInput {
  /** Date de naissance ISO (yyyy-mm-dd). */
  readonly birthDate: string;
  /** Revenu net mensuel du foyer en euros. */
  readonly monthlyIncome: number;
  readonly couple: boolean;
  /** Période de calcul, ex. "2026-06". */
  readonly period: string;
}

/** Situation OpenFisca (structure libre côté API /calculate). */
export type OpenFiscaSituation = Record<string, unknown>;

export function buildAspaSituation(input: AspaInput): OpenFiscaSituation {
  const { birthDate, monthlyIncome, couple, period } = input;

  const individus: Record<string, unknown> = {
    demandeur: {
      date_naissance: { ETERNITY: birthDate },
      retraite_nette: { [period]: monthlyIncome },
    },
  };

  const parents = ["demandeur"];
  if (couple) {
    individus.conjoint = {
      date_naissance: { ETERNITY: birthDate },
      retraite_nette: { [period]: 0 },
    };
    parents.push("conjoint");
  }

  return {
    individus,
    menages: {
      menage_1: {
        personne_de_reference: ["demandeur"],
        ...(couple ? { conjoint: ["conjoint"] } : {}),
      },
    },
    foyers_fiscaux: {
      foyer_1: { declarants: parents },
    },
    familles: {
      famille_1: {
        parents,
        // Valeur à calculer (null = demande de calcul à OpenFisca).
        aspa: { [period]: null },
      },
    },
  };
}
