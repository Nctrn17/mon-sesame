import type { Commune } from "./types";

/**
 * Recherche de communes via l'API Découpage administratif officielle
 * (geo.api.gouv.fr, BAN/INSEE). Gratuite, sans clé, CORS activé : on peut
 * l'appeler depuis le navigateur. Couvre toute la France, ce qui rend le
 * passage de l'IDF au national transparent.
 */

const API_URL = "https://geo.api.gouv.fr/communes";
const FIELDS = "nom,code,codesPostaux,codeDepartement,codeRegion,codeEpci,population";

interface ApiCommune {
  code: string;
  nom: string;
  codesPostaux?: string[];
  codeDepartement?: string;
  codeRegion?: string;
  codeEpci?: string;
  population?: number;
}

function toCommune(c: ApiCommune): Commune {
  return {
    code: c.code,
    nom: c.nom,
    codesPostaux: c.codesPostaux ?? [],
    codeDepartement: c.codeDepartement ?? "",
    codeRegion: c.codeRegion ?? "",
    codeEpci: c.codeEpci,
    population: c.population,
  };
}

export async function searchCommunes(
  query: string,
  signal?: AbortSignal,
): Promise<Commune[]> {
  // Plafond de longueur défensif avant tout appel externe.
  const trimmed = query.trim().slice(0, 200);
  if (trimmed.length < 2) return [];

  const params = new URLSearchParams({ fields: FIELDS, limit: "12", boost: "population" });
  const isPostalCode = /^\d{2,5}$/.test(trimmed);
  if (isPostalCode) {
    params.set("codePostal", trimmed);
  } else {
    params.set("nom", trimmed);
  }

  const res = await fetch(`${API_URL}?${params.toString()}`, { signal });
  if (!res.ok) {
    throw new Error(`Recherche de commune indisponible (HTTP ${res.status}).`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Format de réponse inattendu de l'API géographique.");
  }
  return (data as ApiCommune[]).map(toCommune);
}
