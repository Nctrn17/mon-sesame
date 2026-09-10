import type { Profile } from "@/domain/profile/types";

/**
 * Résume le profil en une phrase lisible pour la carte « Votre situation ».
 * Ex. « Retraité(e), Paris. Vit seul(e), non imposable, locataire. A parfois besoin d'aide au quotidien. »
 */
export function describeProfile(p: Profile): string {
  const proche = p.fillingFor === "relative";
  const sujet = proche ? "Votre proche" : "Vous";
  const parts: string[] = [];

  const statut =
    p.retirement === "retraite"
      ? "à la retraite"
      : p.retirement === "bientot"
        ? "bientôt à la retraite"
        : p.retirement === "actif"
          ? "encore en activité"
          : null;
  const lieu = p.commune?.nom ?? null;
  const first = [statut ? `${sujet === "Vous" ? "Vous êtes" : "Votre proche est"} ${statut}` : null, lieu]
    .filter(Boolean)
    .join(", ");
  if (first) parts.push(first + ".");

  const vie: string[] = [];
  if (p.maritalSituation === "seul") vie.push(proche ? "vit seul(e)" : "vivez seul(e)");
  if (p.maritalSituation === "couple") vie.push(proche ? "vit en couple" : "vivez en couple");
  if (p.taxStatus === "non_imposable") vie.push("non imposable");
  if (p.taxStatus === "imposable") vie.push("imposable");
  if (p.housing === "proprietaire") vie.push("propriétaire");
  if (p.housing === "locataire") vie.push("locataire");
  if (p.housing === "heberge") vie.push(proche ? "hébergé(e) par des proches" : "hébergé(e) par des proches");
  if (p.housing === "etablissement") vie.push("en établissement");
  if (vie.length > 0) {
    const [v0, ...rest] = vie;
    const lead = v0.startsWith("vit") || v0.startsWith("vivez") ? v0 : proche ? `est ${v0}` : `êtes ${v0}`;
    parts.push(`${sujet} ${[lead, ...rest].join(", ")}.`);
  }

  const aide =
    p.autonomy === "jamais"
      ? "Aucun besoin d'aide au quotidien."
      : p.autonomy === "parfois"
        ? "A parfois besoin d'aide au quotidien."
        : p.autonomy === "souvent"
          ? "A souvent besoin d'aide au quotidien."
          : p.autonomy === "quotidien"
            ? "A besoin d'aide tous les jours."
            : null;
  if (aide) parts.push(proche ? aide : aide.replace(/^A /, "Vous avez ").replace(/^Aucun/, "Aucun"));

  if (p.recentlyWidowed) parts.push(proche ? "Veuvage récent." : "Vous avez perdu votre conjoint récemment.");
  if (p.disability) parts.push("Handicap ou invalidité reconnu.");

  return parts.length > 0 ? parts.join(" ") : "Vos réponses au questionnaire.";
}
