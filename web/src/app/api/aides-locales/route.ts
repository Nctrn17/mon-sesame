import { NextResponse } from "next/server";

import { plainText } from "@/domain/geo/plainText";

/**
 * Aides et services locaux d'une commune via l'API data.inclusion
 * (services pour les personnes : mobilité, logement, accès aux droits...).
 *
 * Nécessite une clé gratuite (DATA_INCLUSION_API_KEY). Sans clé, la route
 * répond { configured: false } et l'interface n'affiche rien : l'application
 * fonctionne normalement avec ses aides nationales.
 *
 * Endpoint v1 confirmé en conditions réelles (token du 2026-06-05). Le parsing
 * reste volontairement défensif : les champs sont optionnels selon les sources.
 */

const BASE = "https://api.data.inclusion.beta.gouv.fr/api/v1";
const TIMEOUT_MS = 5000;
const INSEE = /^[0-9AB]{5}$/i;
const MAX_SERVICES = 8;

/**
 * Sous-thèmes data.inclusion pertinents pour un public senior (et ses aidants).
 * On filtre la recherche pour écarter le bruit (emploi, création d'entreprise,
 * permis de conduire, garde d'enfants, numérique, microcrédit pro...) et ne
 * garder que santé, autonomie, logement, mobilité douce, accès aux droits,
 * surendettement, aide ménagère, alimentation, aidants. Le budget et le
 * numérique sont couverts par les guichets de l'Annuaire (Point Conseil
 * Budget, France Services), plus fiables.
 *
 * IMPORTANT : on liste des SOUS-thèmes (« racine--sous-theme »), jamais des
 * racines seules. L'API data.inclusion renvoie une erreur 500 dès qu'on combine
 * plusieurs valeurs racines (« Categorie ») ; les sous-thèmes (« Thematique »)
 * se combinent sans souci. Ne pas « simplifier » en racines : ça casse la route.
 */
const THEMATIQUES_SENIORS = [
  // Santé et autonomie
  "sante--acces-aux-soins",
  "sante--sante-mentale",
  "sante--constituer-un-dossier-mdph-invalidite",
  // Mobilité
  "mobilite--etre-accompagne-dans-son-parcours-mobilite",
  "mobilite--mobilite-douce-partagee-collective",
  // Logement
  "logement-hebergement--changer-de-logement",
  "logement-hebergement--louer-un-logement",
  "logement-hebergement--rechercher-une-solution-dhebergement-temporaire",
  "logement-hebergement--reduire-les-impayes-de-loyer",
  "logement-hebergement--se-maintenir-dans-le-logement",
  "logement-hebergement--sinformer-sur-les-demarches-liees-a-lacces-au-logement",
  // Accès aux droits, démarches, justice
  "difficultes-administratives-ou-juridiques--accompagnement-aux-demarches-administratives",
  "difficultes-administratives-ou-juridiques--accompagnement-pour-lacces-aux-droits",
  "difficultes-administratives-ou-juridiques--beneficier-dune-mesure-daccompagnement-adapte",
  "difficultes-administratives-ou-juridiques--prendre-en-compte-une-problematique-judiciaire",
  // Budget et difficultés financières
  "difficultes-financieres--mettre-en-place-une-mesure-de-protection-financiere",
  "difficultes-financieres--situation-dendettement-surendettement",
  // Équipement, aide ménagère, alimentation
  "equipement-et-alimentation--aide-menagere",
  "equipement-et-alimentation--alimentation",
  "equipement-et-alimentation--electromenager",
  // Aidants et dépendance
  "famille--prise-en-charge-personne-dependante",
  "famille--soutien-aidants",
] as const;

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const insee = (searchParams.get("insee") ?? "").toUpperCase();
  if (!INSEE.test(insee)) {
    return NextResponse.json({ configured: true, services: [], reason: "Code commune invalide." }, { status: 400 });
  }

  const key = process.env.DATA_INCLUSION_API_KEY;
  if (!key) {
    return NextResponse.json({ configured: false, services: [] });
  }

  const params = new URLSearchParams({ code_commune: insee, size: String(MAX_SERVICES) });
  for (const theme of THEMATIQUES_SENIORS) params.append("thematiques", theme);
  const url = `${BASE}/search/services?${params.toString()}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
    });
    if (!res.ok) return NextResponse.json({ configured: true, services: [] });

    const data = asObject(await res.json());
    const rawItems = Array.isArray(data.items)
      ? data.items
      : Array.isArray(data.results)
        ? data.results
        : [];

    const services = rawItems
      .slice(0, MAX_SERVICES)
      .map((item) => {
        const it = asObject(item);
        const svc = asObject(it.service ?? it);
        const structure = asObject(svc.structure ?? it.structure);
        return {
          nom: str(svc.nom),
          resume: plainText(svc.description),
          structure: str(structure.nom),
          telephone: str(svc.telephone) ?? str(structure.telephone),
          courriel: str(svc.courriel) ?? str(structure.courriel),
          lien: str(svc.lien_source) ?? str(structure.site_web),
        };
      })
      .filter((s) => s.nom !== null);

    return NextResponse.json({ configured: true, services });
  } catch {
    return NextResponse.json({ configured: true, services: [] });
  } finally {
    clearTimeout(timeout);
  }
}
