import { NextResponse } from "next/server";
import { buildAspaSituation } from "@/domain/eligibility/openfisca/mapping";

/**
 * Route proxy vers le service OpenFisca-France (couche nationale exacte).
 *
 * Le service Python n'est pas toujours lancé (ex. en développement sans
 * `openfisca serve`). Dans ce cas, on répond proprement `available: false`
 * et l'interface bascule sur l'estimation locale, sans jamais planter.
 *
 * Données : on ne reçoit qu'une date de naissance, un revenu mensuel et le
 * statut de couple, le temps d'un calcul. Rien n'est stocké côté serveur.
 */

/** Valide l'URL du service au chargement (fail fast, anti-SSRF). */
function resolveOpenfiscaUrl(): string {
  const raw = process.env.OPENFISCA_URL ?? "http://localhost:5000";
  const parsed = new URL(raw); // lève si l'URL est malformée
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`OPENFISCA_URL doit utiliser http ou https (reçu : ${parsed.protocol}).`);
  }
  return raw;
}

const OPENFISCA_URL = resolveOpenfiscaUrl();
const ISO_DATE = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;
const MAX_MONTHLY_INCOME = 100_000;
const TIMEOUT_MS = 4000;

interface Body {
  birthDate?: unknown;
  monthlyIncome?: unknown;
  couple?: unknown;
}

function currentPeriod(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

function badRequest(reason: string) {
  return NextResponse.json({ available: false, reason }, { status: 400 });
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return badRequest("Requête invalide.");
  }

  const birthDate =
    typeof body.birthDate === "string" && ISO_DATE.test(body.birthDate) ? body.birthDate : null;
  const monthlyIncome =
    typeof body.monthlyIncome === "number" && Number.isFinite(body.monthlyIncome)
      ? body.monthlyIncome
      : null;
  const couple = body.couple === true;

  if (!birthDate) {
    return badRequest("Date de naissance invalide.");
  }
  const year = Number(birthDate.slice(0, 4));
  if (year < 1900 || year > new Date().getFullYear()) {
    return badRequest("Date de naissance hors plage.");
  }
  if (monthlyIncome == null || monthlyIncome < 0 || monthlyIncome > MAX_MONTHLY_INCOME) {
    return badRequest("Revenu mensuel invalide.");
  }

  const period = currentPeriod();
  const situation = buildAspaSituation({ birthDate, monthlyIncome, couple, period });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(new URL("/calculate", OPENFISCA_URL).toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(situation),
      signal: controller.signal,
    });

    if (!res.ok) {
      return NextResponse.json({ available: false, reason: "Service OpenFisca indisponible." });
    }

    const data = (await res.json()) as {
      familles?: { famille_1?: { aspa?: Record<string, number | null> } };
    };
    const monthlyAmount = data.familles?.famille_1?.aspa?.[period];

    if (typeof monthlyAmount !== "number") {
      return NextResponse.json({ available: false, reason: "Réponse OpenFisca inattendue." });
    }

    return NextResponse.json({
      available: true,
      monthlyAmount,
      annualAmount: Math.round(monthlyAmount * 12),
    });
  } catch {
    return NextResponse.json({
      available: false,
      reason: "Service OpenFisca non joignable (calcul local utilisé).",
    });
  } finally {
    clearTimeout(timeout);
  }
}
