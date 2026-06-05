/**
 * Calcul d'âge. Fonctions pures et testables : la date de référence est
 * passée en argument (pas d'appel caché à l'horloge dans la logique métier).
 */

export function ageAt(birthDateIso: string, reference: Date): number | null {
  const birth = new Date(birthDateIso);
  if (Number.isNaN(birth.getTime())) return null;

  let age = reference.getFullYear() - birth.getFullYear();
  const monthDelta = reference.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && reference.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age >= 0 && age < 130 ? age : null;
}

/** Variante pratique pour l'application (utilise l'horloge système). */
export function currentAge(birthDateIso: string): number | null {
  return ageAt(birthDateIso, new Date());
}
