import type { AidCategory } from "./types";

/**
 * Thèmes d'affichage : les 13 catégories du catalogue sont trop fines pour
 * une page de résultats lisible par un senior. On les replie en 7 thèmes,
 * dans un ordre fixe pour que la page ait toujours le même squelette.
 */
export type AidTheme =
  | "argent"
  | "sante"
  | "autonomie"
  | "logement"
  | "retraite"
  | "transport"
  | "quotidien";

export const THEME_ORDER: readonly AidTheme[] = [
  "argent",
  "sante",
  "autonomie",
  "logement",
  "retraite",
  "transport",
  "quotidien",
];

export const THEME_LABELS: Record<AidTheme, string> = {
  argent: "Revenus et impôts",
  sante: "Santé",
  autonomie: "Autonomie, handicap et proches aidants",
  logement: "Logement et énergie",
  retraite: "Retraite et veuvage",
  transport: "Transports",
  quotidien: "Vie quotidienne",
};

export const CATEGORY_THEME: Record<AidCategory, AidTheme> = {
  minima: "argent",
  fiscal: "argent",
  sante: "sante",
  autonomie: "autonomie",
  handicap: "autonomie",
  aidant: "autonomie",
  logement: "logement",
  energie: "logement",
  caisse_retraite: "retraite",
  retraite: "retraite",
  veuvage: "retraite",
  transport: "transport",
  vie_quotidienne: "quotidien",
};

/** Libellé court d'une catégorie (fiche détail). */
export const CATEGORY_LABELS: Record<AidCategory, string> = {
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
