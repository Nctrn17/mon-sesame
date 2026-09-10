/**
 * Barèmes et seuils 2026 (millésime de référence).
 *
 * AVERTISSEMENT : ces valeurs servent à produire des ESTIMATIONS. Elles
 * sont revalorisées chaque année (souvent au 1er janvier et au 1er avril).
 * Chaque bloc porte sa source officielle et doit être revérifié au moins
 * une fois par an. Pour les montants nationaux exacts, le calcul sera
 * délégué à OpenFisca-France (voir src/domain/eligibility/openfisca).
 *
 * Les valeurs marquées "approx" sont des ordres de grandeur volontairement
 * prudents en attendant l'intégration OpenFisca.
 */

export const BAREMES_MILLESIME = 2026 as const;

/** Codes des départements et de la région Île-de-France (premier pack territoire). */
export const IDF = {
  regionCode: "11",
  departementCodes: ["75", "77", "78", "91", "92", "93", "94", "95"],
} as const;

/**
 * Seuils indicatifs de non-imposition (revenu mensuel du foyer), utilisés pour
 * anticiper le passage à la retraite. Valeurs approximatives 2026, à confirmer.
 */
export const SEUIL_IMPOSABLE = {
  mensuelSeul: 1700,
  mensuelCouple: 2600,
} as const;

/** ASPA : allocation de solidarité aux personnes âgées (minimum vieillesse). */
export const ASPA = {
  ageDroitCommun: 65,
  ageInapteOuHandicap: 62,
  // Montant maximum mensuel = plafond de ressources (allocation différentielle).
  plafondMensuelSeul: 1043.59,
  plafondMensuelCouple: 1620.18,
  source: {
    label: "service-public.gouv.fr : ASPA",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F16871",
  },
} as const;

/** ASI : allocation supplémentaire d'invalidité (passerelle avant l'âge de la retraite). */
export const ASI = {
  // L'ASI cesse à l'âge légal de départ à la retraite (62 à 64 ans selon l'année de naissance).
  ageMax: 64,
  source: {
    label: "service-public.gouv.fr : ASI",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F16940",
  },
} as const;

/** Complémentaire santé solidaire. */
export const CSS = {
  // Plafonds annuels de ressources (personne seule).
  plafondAnnuelSeulGratuite: 10421,
  plafondAnnuelSeulParticipation: 14069,
  plafondAnnuelCoupleGratuite: 15632,
  source: {
    label: "service-public.gouv.fr : Complémentaire santé solidaire",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F10027",
  },
} as const;

/** Chèque énergie. */
export const CHEQUE_ENERGIE = {
  // Revenu fiscal de référence par unité de consommation (plafond approx).
  plafondRfrParUc: 11000,
  montantMin: 48,
  montantMax: 277,
  source: {
    label: "chequeenergie.gouv.fr",
    url: "https://www.chequeenergie.gouv.fr/",
  },
} as const;

/** APA à domicile : allocation personnalisée d'autonomie (pas de plafond de ressources). */
export const APA = {
  ageMin: 60,
  // Plafonds mensuels du plan d'aide selon le GIR (euros/mois).
  plafondMensuelGir1: 2080.33,
  plafondMensuelGir2: 1682.3,
  plafondMensuelGir3: 1215.99,
  plafondMensuelGir4: 811.52,
  source: {
    label: "pour-les-personnes-agees.gouv.fr : APA",
    url: "https://www.pour-les-personnes-agees.gouv.fr/vivre-a-domicile/aides-financieres/l-apa-a-domicile",
  },
} as const;

/** Aide-ménagère / action sociale des caisses de retraite (GIR 5-6). */
export const ACTION_SOCIALE_CARSAT = {
  ageMin: 55,
  // Plan d'aide personnalisé : ordre de grandeur annuel (approx).
  plafondAnnuelApprox: 3000,
  source: {
    label: "lassuranceretraite.fr : bien chez soi",
    url: "https://www.lassuranceretraite.fr/portail-info/home/retraite/vie-retraite-bien-vieillir/bien-chez-soi.html",
  },
} as const;

/** MaPrimeAdapt' : adaptation du logement au vieillissement. */
export const MAPRIMEADAPT = {
  ageSansConditionAutonomie: 70,
  ageMinAvecGir: 60,
  plafondTravaux: 22000,
  tauxModeste: 0.5,
  tauxTresModeste: 0.7,
  source: {
    label: "france-renov.gouv.fr : MaPrimeAdapt'",
    url: "https://france-renov.gouv.fr/aides/maprimeadapt",
  },
} as const;

/** Exonération / dégrèvement de taxe foncière (résidence principale). */
export const TAXE_FONCIERE = {
  ageExonerationTotale: 75,
  ageDegrevement: 65,
  degrevementForfaitaire: 100,
  // Plafond de RFR pour 1 part (approx) + majoration par demi-part.
  plafondRfrUnePart: 12793,
  majorationParDemiPart: 3416,
  // Économie annuelle moyenne approximative pour un propriétaire en IDF.
  economieAnnuelleApprox: 700,
  source: {
    label: "service-public.gouv.fr : exonération de taxe foncière",
    url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F59",
  },
} as const;

/** Transport senior en Île-de-France (forfait Améthyste et Navigo Senior). */
export const TRANSPORT_IDF = {
  ageAmethyste: 65,
  // 60 ans en cas d'inaptitude au travail (invalidité, AAH) selon les départements.
  ageAmethysteInapte: 60,
  ageNavigoSenior: 62,
  // Valeur indicative d'un Navigo annuel toutes zones (économie potentielle).
  valeurAnnuelleNavigo: 900,
  // Économie du Navigo Senior (réduction d'environ 50%).
  economieNavigoSenior: 450,
  source: {
    label: "iledefrance-mobilites.fr : forfait Améthyste",
    url: "https://www.iledefrance-mobilites.fr/titres-et-tarifs/detail/forfait-amethyste",
  },
} as const;

/** Pension de réversion (ordre de grandeur, très variable selon le régime). */
export const REVERSION = {
  source: {
    label: "info-retraite.fr : pension de réversion",
    url: "https://www.info-retraite.fr/portail-info/sites/PortailInformationnel/home/mes-droits-a-la-retraite/ma-vie-personnelle-1/famille/pension-de-reversion-1.html",
  },
} as const;

/** Formate un montant en euros à la française, sans décimales. */
export function formatEuros(amount: number): string {
  return `${Math.round(amount).toLocaleString("fr-FR")} €`;
}
