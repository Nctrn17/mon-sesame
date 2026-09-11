import { CATEGORY_THEME, THEME_ORDER, type AidTheme } from "@/domain/aids/themes";
import type { AidResult } from "./types";

export interface ThemeGroup {
  readonly theme: AidTheme;
  readonly items: readonly AidResult[];
}

/**
 * Page de résultats en trois niveaux :
 * - `toRequest` : éligible, impact élevé ou moyen (les vrais droits) ;
 * - `toCheck` : à vérifier, impact élevé ou moyen ;
 * - `goodToKnow` : tout ce qui est « coup de pouce », éligible ou à vérifier,
 *   replié par défaut pour ne pas noyer les droits importants ;
 * - `other` : non concerné ou inconnu.
 * Les trois premiers sont regroupés par thème, dans l'ordre fixe des thèmes ;
 * l'ordre du moteur (statut, impact, nom) est conservé dans chaque thème.
 */
export interface GroupedResults {
  readonly toRequest: readonly ThemeGroup[];
  readonly toCheck: readonly ThemeGroup[];
  readonly goodToKnow: readonly ThemeGroup[];
  readonly other: readonly AidResult[];
}

export function byTheme(items: readonly AidResult[]): ThemeGroup[] {
  return THEME_ORDER.map((theme) => ({
    theme,
    items: items.filter((r) => CATEGORY_THEME[r.aid.category] === theme),
  })).filter((g) => g.items.length > 0);
}

export function countItems(groups: readonly ThemeGroup[]): number {
  return groups.reduce((n, g) => n + g.items.length, 0);
}

export function groupResults(results: readonly AidResult[]): GroupedResults {
  const active = (r: AidResult) => r.status === "eligible" || r.status === "to_check";
  const important = (r: AidResult) => r.aid.impact !== "coup_de_pouce";
  return {
    toRequest: byTheme(results.filter((r) => r.status === "eligible" && important(r))),
    toCheck: byTheme(results.filter((r) => r.status === "to_check" && important(r))),
    goodToKnow: byTheme(results.filter((r) => active(r) && !important(r))),
    other: results.filter((r) => !active(r)),
  };
}
