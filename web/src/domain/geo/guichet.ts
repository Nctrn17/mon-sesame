/**
 * Client (navigateur) pour les guichets locaux d'une commune (CCAS et conseil
 * départemental), via notre route /api/guichet qui relaie l'API Annuaire de
 * l'administration. Renvoie null pour un guichet introuvable.
 */

export interface LocalGuichet {
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
