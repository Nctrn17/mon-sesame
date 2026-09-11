import { NextResponse } from "next/server";

/**
 * Trouve les guichets locaux d'une commune via l'API Annuaire de
 * l'administration (data.gouv.fr / DILA, Opendatasoft). Sans clé.
 *
 * Deux usages :
 * - sans `type` : le CCAS (pivot "ccas", par code INSEE) et le conseil
 *   départemental (pivot "cg", par préfixe de département), pour la carte
 *   « Pour commencer » ;
 * - avec `type` (pcb, clic, cpam, sip...) : le guichet de ce type le plus
 *   proche. On cherche d'abord dans la commune, puis dans tout le
 *   département, trié par distance au centre de la commune quand on a
 *   ses coordonnées (`lat`, `lon`). Nécessaire à Paris (arrondissements)
 *   et dans les petites communes qui n'ont pas leur propre guichet.
 *
 * Dégradation gracieuse : en cas d'erreur, on renvoie null et l'interface
 * garde son libellé générique.
 */

const ODS_BASE =
  "https://api-lannuaire.service-public.gouv.fr/api/explore/v2.1/catalog/datasets/api-lannuaire-administration/records";
const TIMEOUT_MS = 4500;
const INSEE = /^[0-9AB]{5}$/i;
const DEPT = /^(2[AB]|[0-9]{2,3})$/i;
const TYPES = new Set([
  "ccas",
  "cg",
  "clic",
  "cpam",
  "caf",
  "sip",
  "pcb",
  "france_services",
  "cicas",
  "anah",
  "mjd",
  "mairie",
]);
/** Un département compte rarement plus de 50 guichets d'un même type. */
const DEPT_LIMIT = 100;

interface Org {
  nom: string | null;
  telephone: string | null;
  adresse: string | null;
  siteInternet: string | null;
  email: string | null;
  /** Distance au centre de la commune, en km (si calculable). */
  distanceKm: number | null;
}

function parseMaybeJson(raw: unknown): unknown {
  if (typeof raw !== "string") return raw;
  const trimmed = raw.trim();
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return raw;
    }
  }
  return raw;
}

function firstValue(raw: unknown, ...keys: string[]): string | null {
  const v = parseMaybeJson(raw);
  if (typeof v === "string") return v.trim() || null;
  if (Array.isArray(v) && v.length > 0 && typeof v[0] === "object" && v[0]) {
    for (const key of keys) {
      const candidate = (v[0] as Record<string, unknown>)[key];
      if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
    }
  }
  return null;
}

function firstAddress(raw: unknown): Record<string, unknown> | null {
  const v = parseMaybeJson(raw);
  if (Array.isArray(v) && v.length > 0 && typeof v[0] === "object" && v[0]) {
    return v[0] as Record<string, unknown>;
  }
  return null;
}

function extractAddress(raw: unknown): string | null {
  const v = parseMaybeJson(raw);
  if (typeof v === "string") return v.trim() || null;
  const a = firstAddress(raw);
  if (!a) return null;
  const str = (k: string) => (typeof a[k] === "string" ? (a[k] as string).trim() : "");
  const line = [str("numero_voie"), str("complement1"), str("complement2")].filter(Boolean).join(", ");
  const city = [str("code_postal"), str("nom_commune")].filter(Boolean).join(" ");
  const full = [line, city].filter(Boolean).join(", ");
  return full || null;
}

function extractCoords(raw: unknown): { lat: number; lon: number } | null {
  const a = firstAddress(raw);
  if (!a) return null;
  const lat = Number.parseFloat(String(a.latitude ?? ""));
  const lon = Number.parseFloat(String(a.longitude ?? ""));
  return Number.isFinite(lat) && Number.isFinite(lon) && (lat !== 0 || lon !== 0) ? { lat, lon } : null;
}

/** Distance orthodromique en km (formule de haversine). */
function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function toOrg(record: Record<string, unknown>, from: { lat: number; lon: number } | null): Org {
  const coords = extractCoords(record.adresse);
  return {
    nom: typeof record.nom === "string" ? record.nom : null,
    telephone: firstValue(record.telephone, "valeur", "numero"),
    adresse: extractAddress(record.adresse),
    siteInternet: firstValue(record.site_internet, "valeur"),
    email: firstValue(record.adresse_courriel, "valeur"),
    distanceKm: from && coords ? Math.round(haversineKm(from, coords) * 10) / 10 : null,
  };
}

async function fetchRecords(
  where: string,
  limit: number,
  signal: AbortSignal,
): Promise<Array<Record<string, unknown>>> {
  try {
    const url = `${ODS_BASE}?where=${encodeURIComponent(where)}&limit=${limit}`;
    const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
    if (!res.ok) return [];
    const data = (await res.json()) as { results?: Array<Record<string, unknown>> };
    return Array.isArray(data.results) ? data.results : [];
  } catch {
    return [];
  }
}

async function fetchOrg(where: string, signal: AbortSignal): Promise<Org | null> {
  const [record] = await fetchRecords(where, 1, signal);
  return record ? toOrg(record, null) : null;
}

/** Guichet d'un type donné : dans la commune, sinon le plus proche du département. */
async function fetchNearest(
  type: string,
  insee: string,
  dept: string,
  from: { lat: number; lon: number } | null,
  signal: AbortSignal,
): Promise<Org | null> {
  const local = await fetchRecords(
    `pivot like "${type}" and code_insee_commune like "${insee}"`,
    5,
    signal,
  );
  if (local.length > 0) {
    const orgs = local.map((r) => toOrg(r, from));
    orgs.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    return orgs[0];
  }
  if (!DEPT.test(dept)) return null;
  const inDept = await fetchRecords(
    `pivot like "${type}" and code_insee_commune like "${dept}*"`,
    DEPT_LIMIT,
    signal,
  );
  if (inDept.length === 0) return null;
  const orgs = inDept.map((r) => toOrg(r, from));
  if (from) {
    // Sans coordonnées sur la fiche, on ne peut pas dire qu'elle est proche.
    const located = orgs.filter((o) => o.distanceKm !== null);
    if (located.length > 0) {
      located.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
      return located[0];
    }
  }
  return orgs[0];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const insee = (searchParams.get("insee") ?? "").toUpperCase();
  const dept = (searchParams.get("dept") ?? "").toUpperCase();
  const type = searchParams.get("type");
  if (!INSEE.test(insee)) {
    return NextResponse.json({ ccas: null, departement: null, reason: "Code commune invalide." }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    if (type !== null) {
      if (!TYPES.has(type)) {
        return NextResponse.json({ guichet: null, reason: "Type de guichet inconnu." }, { status: 400 });
      }
      const lat = Number.parseFloat(searchParams.get("lat") ?? "");
      const lon = Number.parseFloat(searchParams.get("lon") ?? "");
      const from = Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null;
      const guichet = await fetchNearest(type, insee, dept, from, controller.signal);
      return NextResponse.json({ guichet });
    }

    const [ccas, departement] = await Promise.all([
      fetchOrg(`pivot like "ccas" and code_insee_commune like "${insee}"`, controller.signal),
      DEPT.test(dept)
        ? fetchOrg(`pivot like "cg" and code_insee_commune like "${dept}*"`, controller.signal)
        : Promise.resolve<Org | null>(null),
    ]);
    return NextResponse.json({ ccas, departement });
  } catch {
    return NextResponse.json({ ccas: null, departement: null, guichet: null });
  } finally {
    clearTimeout(timeout);
  }
}
