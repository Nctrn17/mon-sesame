/**
 * Convertit un texte markdown en texte simple et lisible.
 *
 * Les descriptions renvoyées par data.inclusion contiennent du markdown brut
 * (titres « ### », gras « **...** », liens « [texte](url) », commentaires HTML,
 * astérisques échappés...). Le public de Boussole est peu à l'aise avec la
 * technologie : on retire toute cette syntaxe et on tronque proprement à la fin
 * d'un mot pour n'afficher qu'un résumé court et clair.
 */

const DEFAULT_MAX_LEN = 180;

export function plainText(value: unknown, maxLen: number = DEFAULT_MAX_LEN): string | null {
  if (typeof value !== "string") return null;

  const cleaned = value
    .replace(/<!--[\s\S]*?-->/g, " ") // commentaires HTML
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // liens [texte](url) -> texte
    .replace(/<https?:\/\/[^>\s]+>/g, " ") // urls entre chevrons
    .replace(/^\s{0,3}#{1,6}\s*/gm, "") // titres ###
    .replace(/^\s{0,3}>\s?/gm, "") // citations >
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "") // puces et listes numérotées
    .replace(/\\([\\`*_{}[\]()#+\-.!~>])/g, "$1") // déséchappe \* \_ ...
    .replace(/[*_`]+/g, "") // gras / italique / code restants
    .replace(/\s+/g, " ") // espaces et sauts de ligne multiples
    .trim();

  if (!cleaned) return null;
  if (cleaned.length <= maxLen) return cleaned;

  const cut = cleaned.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > maxLen * 0.6 ? cut.slice(0, lastSpace) : cut;
  return base.trimEnd() + "…";
}
