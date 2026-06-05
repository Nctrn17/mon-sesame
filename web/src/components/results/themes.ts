import type { AidCategory } from "@/domain/aids/types";

/**
 * Regroupement des catégories d'aides en grands thèmes lisibles, pour
 * présenter les résultats en sections repliables plutôt qu'en longue liste.
 */
export interface Theme {
  readonly key: string;
  readonly label: string;
  readonly icon: string;
}

const THEMES: Record<string, Theme> = {
  revenu: { key: "revenu", label: "Revenu et retraite", icon: "💶" },
  sante: { key: "sante", label: "Santé", icon: "🩺" },
  autonomie: { key: "autonomie", label: "Autonomie et aide à domicile", icon: "🤝" },
  logement: { key: "logement", label: "Logement et énergie", icon: "🏠" },
  transport: { key: "transport", label: "Transport", icon: "🚌" },
  impots: { key: "impots", label: "Impôts", icon: "🧾" },
  quotidien: { key: "quotidien", label: "Vie quotidienne et droits", icon: "🧭" },
};

export const THEME_ORDER: readonly string[] = [
  "revenu",
  "sante",
  "autonomie",
  "logement",
  "transport",
  "impots",
  "quotidien",
];

const CATEGORY_TO_THEME: Record<AidCategory, string> = {
  minima: "revenu",
  retraite: "revenu",
  veuvage: "revenu",
  sante: "sante",
  autonomie: "autonomie",
  handicap: "autonomie",
  caisse_retraite: "autonomie",
  aidant: "autonomie",
  logement: "logement",
  energie: "logement",
  transport: "transport",
  fiscal: "impots",
  vie_quotidienne: "quotidien",
};

export function themeKeyForCategory(category: AidCategory): string {
  return CATEGORY_TO_THEME[category];
}

export function themeByKey(key: string): Theme {
  return THEMES[key];
}
