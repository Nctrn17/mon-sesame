import { NextResponse } from "next/server";

/**
 * Trouve les guichets locaux d'une commune via l'API Annuaire de
 * l'administration (data.gouv.fr / DILA, Opendatasoft). Sans clé.
 *
 * - CCAS : par code INSEE de la commune (pivot "ccas").
 * - Conseil départemental : par préfixe du département (pivot "cg", dont le
 *   code commune est le chef-lieu). Le département finance l'APA, l'ASH,
 *   l'aide-ménagère, l'Améthyste : c'est un interlocuteur clé.
 *
 * Dégradation gracieuse : en cas d'erreur, on renvoie null pour le guichet
 * concerné et l'interface affiche un message générique.
 */

const ODS_BASE =
  "https://api-lannuaire.service-public.gouv.fr/api/explore/v2.1/catalog/datasets/api-lannuaire-administration/records";
const TIMEOUT_MS = 4500;
const INSEE = /^[0-9AB]{5}$/i;
const DEPT = /^(2[AB]|[0-9]{2,3})$/i;

interface Org {
  nom: string | null;
  telephone: string | null;
  adresse: string | null;
  siteInternet: string | null;
  email: string | null;
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

function extractAddress(raw: unknown): string | null {
  const v = parseMaybeJson(raw);
  if (typeof v === "string") return v.trim() || null;
  if (Array.isArray(v) && v.length > 0 && typeof v[0] === "object" && v[0]) {
    const a = v[0] as Record<string, unknown>;
    const str = (k: string) => (typeof a[k] === "string" ? (a[k] as string).trim() : "");
    const line = [str("numero_voie"), str("complement1"), str("complement2")].filter(Boolean).join(", ");
    const city = [str("code_postal"), str("nom_commune")].filter(Boolean).join(" ");
    const full = [line, city].filter(Boolean).join(", ");
    return full || null;
  }
  return null;
}

async function fetchOrg(where: string, signal: AbortSignal): Promise<Org | null> {
  try {
    const url = `${ODS_BASE}?where=${encodeURIComponent(where)}&limit=1`;
    const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = (await res.json()) as { results?: Array<Record<string, unknown>> };
    const record = Array.isArray(data.results) ? data.results[0] : undefined;
    if (!record) return null;
    return {
      nom: typeof record.nom === "string" ? record.nom : null,
      telephone: firstValue(record.telephone, "valeur", "numero"),
      adresse: extractAddress(record.adresse),
      siteInternet: firstValue(record.site_internet, "valeur"),
      email: firstValue(record.adresse_courriel, "valeur"),
    };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const insee = (searchParams.get("insee") ?? "").toUpperCase();
  const dept = (searchParams.get("dept") ?? "").toUpperCase();
  if (!INSEE.test(insee)) {
    return NextResponse.json({ ccas: null, departement: null, reason: "Code commune invalide." }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const [ccas, departement] = await Promise.all([
      fetchOrg(`pivot like "ccas" and code_insee_commune like "${insee}"`, controller.signal),
      DEPT.test(dept)
        ? fetchOrg(`pivot like "cg" and code_insee_commune like "${dept}*"`, controller.signal)
        : Promise.resolve<Org | null>(null),
    ]);
    return NextResponse.json({ ccas, departement });
  } catch {
    return NextResponse.json({ ccas: null, departement: null });
  } finally {
    clearTimeout(timeout);
  }
}
