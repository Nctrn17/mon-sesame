/**
 * Modèle géographique abstrait.
 *
 * L'architecture doit pouvoir passer de l'Île-de-France à toute la France
 * sans réécriture : on raisonne en niveaux (commune, EPCI, département,
 * région, national) et jamais en "IDF" codé en dur.
 */

export type DepartementCode = string; // ex: "75", "94", "2A"
export type RegionCode = string; // ex: "11" pour l'Île-de-France
export type EpciCode = string;
export type CommuneCode = string; // code INSEE

export interface Commune {
  /** Code INSEE (identifiant stable, pas le code postal). */
  readonly code: CommuneCode;
  readonly nom: string;
  readonly codesPostaux: readonly string[];
  readonly codeDepartement: DepartementCode;
  readonly codeRegion: RegionCode;
  readonly codeEpci?: EpciCode;
  readonly population?: number;
}
