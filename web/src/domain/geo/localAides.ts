/**
 * Client (navigateur) pour les aides et services locaux d'une commune,
 * via notre route /api/aides-locales (qui relaie data.inclusion).
 * Renvoie une liste vide tant que la clé API n'est pas configurée.
 */

export interface LocalService {
  readonly nom: string | null;
  readonly resume: string | null;
  readonly structure: string | null;
  readonly telephone: string | null;
  readonly courriel: string | null;
  readonly lien: string | null;
}

export interface LocalServicesResult {
  readonly configured: boolean;
  readonly services: LocalService[];
}

export async function findLocalServices(
  inseeCode: string,
  signal?: AbortSignal,
): Promise<LocalServicesResult> {
  try {
    const res = await fetch(`/api/aides-locales?insee=${encodeURIComponent(inseeCode)}`, { signal });
    if (!res.ok) return { configured: true, services: [] };
    const data = (await res.json()) as { configured?: boolean; services?: LocalService[] };
    return {
      configured: data.configured !== false,
      services: Array.isArray(data.services) ? data.services : [],
    };
  } catch {
    return { configured: true, services: [] };
  }
}
