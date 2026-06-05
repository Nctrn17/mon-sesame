/**
 * Client (côté navigateur) pour le calcul exact de l'ASPA. Il interroge
 * notre route interne /api/openfisca/aspa, qui relaie vers le service
 * OpenFisca-France. Si le service n'est pas disponible, on renvoie
 * `available: false` et l'application retombe sur l'estimation locale.
 */

export interface AspaExactRequest {
  readonly birthDate: string;
  readonly monthlyIncome: number;
  readonly couple: boolean;
}

export type AspaExactResult =
  | { readonly available: true; readonly monthlyAmount: number; readonly annualAmount: number }
  | { readonly available: false; readonly reason: string };

export async function computeAspaExact(
  request: AspaExactRequest,
  signal?: AbortSignal,
): Promise<AspaExactResult> {
  try {
    const res = await fetch("/api/openfisca/aspa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal,
    });
    if (!res.ok) {
      return { available: false, reason: `Service indisponible (HTTP ${res.status}).` };
    }
    return (await res.json()) as AspaExactResult;
  } catch {
    return { available: false, reason: "Calcul exact indisponible pour le moment." };
  }
}
