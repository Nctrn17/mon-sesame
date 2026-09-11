import type { GuichetType } from "@/domain/aids/types";
import type { Commune } from "./types";

/**
 * Client (navigateur) pour les guichets locaux d'une commune (CCAS et conseil
 * départemental), via notre route /api/guichet qui relaie l'API Annuaire de
 * l'administration. Renvoie null pour un guichet introuvable.
 */

export interface LocalGuichet {
  /** Distance au centre de la commune, en km (guichet « le plus proche » seulement). */
  readonly distanceKm?: number | null;
  readonly nom: string | null;
  readonly telephone: string | null;
  readonly adresse: string | null;
  readonly siteInternet: string | null;
  readonly email: string | null;
}

export interface Guichets {
  readonly ccas: LocalGuichet | null;
  readonly departement: LocalGuichet | null;
}

function normalize(raw: unknown): LocalGuichet | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Partial<LocalGuichet>;
  const g: LocalGuichet = {
    nom: o.nom ?? null,
    telephone: o.telephone ?? null,
    adresse: o.adresse ?? null,
    siteInternet: o.siteInternet ?? null,
    email: o.email ?? null,
    distanceKm: o.distanceKm ?? null,
  };
  return g.nom || g.telephone || g.adresse ? g : null;
}

export async function findGuichets(
  inseeCode: string,
  departementCode: string,
  signal?: AbortSignal,
): Promise<Guichets> {
  try {
    const params = new URLSearchParams({ insee: inseeCode, dept: departementCode });
    const res = await fetch(`/api/guichet?${params.toString()}`, { signal });
    if (!res.ok) return { ccas: null, departement: null };
    const data = (await res.json()) as { ccas?: unknown; departement?: unknown };
    return { ccas: normalize(data.ccas), departement: normalize(data.departement) };
  } catch {
    return { ccas: null, departement: null };
  }
}

/**
 * Guichet d'un type donné (Point Conseil Budget, CLIC, CPAM...) le plus
 * proche de la commune. Null si introuvable ou en cas d'erreur.
 */
export async function findNearestGuichet(
  type: GuichetType,
  commune: Commune,
  signal?: AbortSignal,
): Promise<LocalGuichet | null> {
  try {
    const params = new URLSearchParams({
      type,
      insee: commune.code,
      dept: commune.codeDepartement,
    });
    if (commune.centre) {
      params.set("lat", String(commune.centre.lat));
      params.set("lon", String(commune.centre.lon));
    }
    const res = await fetch(`/api/guichet?${params.toString()}`, { signal });
    if (!res.ok) return null;
    const data = (await res.json()) as { guichet?: unknown };
    return normalize(data.guichet);
  } catch {
    return null;
  }
}
