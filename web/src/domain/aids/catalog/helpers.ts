import type { Profile, TaxStatus } from "@/domain/profile/types";

/**
 * Nombre d'années écoulées depuis l'ouverture probable d'un droit lié à
 * l'âge, plafonné. Sert à estimer un "manque à gagner passé" (ordre de
 * grandeur des économies non réalisées), jamais une somme récupérable.
 */
export function yearsSinceAge(
  age: number | null,
  thresholdAge: number,
  cap = 3,
): number {
  if (age == null) return 0;
  return Math.max(0, Math.min(cap, age - thresholdAge));
}

/**
 * Lecture prudente du proxy de ressources.
 * "non_imposable" rend très probable le passage sous les plafonds des aides
 * sociales ; "imposable" rend improbable l'éligibilité aux minima sociaux.
 */
export function lowIncomeLikely(taxStatus: TaxStatus | undefined): boolean {
  return taxStatus === "non_imposable";
}

/** Proxy GIR : besoin d'aide marqué (souvent / quotidien) suggère GIR 1-4. */
export function suggestsHeavyDependence(profile: Profile): boolean {
  return profile.autonomy === "souvent" || profile.autonomy === "quotidien";
}

/** Besoin d'aide léger (parfois) suggère plutôt GIR 5-6. */
export function suggestsLightDependence(profile: Profile): boolean {
  return profile.autonomy === "parfois";
}
