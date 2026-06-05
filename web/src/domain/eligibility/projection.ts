import { SEUIL_IMPOSABLE } from "@/domain/aids/baremes";
import { type Profile, updateProfile } from "@/domain/profile/types";

/**
 * Projette un profil "une fois à la retraite", quand les revenus baissent
 * d'un coup. C'est exactement le moment où beaucoup d'aides sous condition de
 * ressources s'ouvrent.
 *
 * - Si la personne a une estimation de sa future retraite, on l'utilise pour
 *   déduire si elle deviendra non imposable et pour estimer l'ASPA.
 * - Sinon, hypothèse prudente et fréquente : revenus modestes, non imposable.
 *
 * Tout est présenté comme une projection, jamais comme une certitude.
 */
export function projectToRetirement(profile: Profile, expectedPension?: number): Profile {
  const couple = profile.maritalSituation === "couple";

  if (expectedPension != null && Number.isFinite(expectedPension) && expectedPension >= 0) {
    const seuil = couple ? SEUIL_IMPOSABLE.mensuelCouple : SEUIL_IMPOSABLE.mensuelSeul;
    return updateProfile(profile, {
      retirement: "retraite",
      monthlyIncome: expectedPension,
      taxStatus: expectedPension <= seuil ? "non_imposable" : "imposable",
    });
  }

  return updateProfile(profile, { retirement: "retraite", taxStatus: "non_imposable" });
}
