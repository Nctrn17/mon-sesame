import type { AidDefinition } from "@/domain/aids/types";
import type { AidVerdict, EvalContext } from "@/domain/eligibility/types";

function evaluateAidant(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.fillingFor === "relative") {
    return {
      status: "eligible",
      explanation: [
        "Vous aidez un proche : vous aussi avez des droits.",
        "Le congé de proche aidant peut être indemnisé (AJPA), et des solutions de répit existent pour souffler.",
      ],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "Si vous aidez régulièrement un proche en perte d'autonomie, vous avez peut-être droit au congé de proche aidant indemnisé (AJPA) et à des solutions de répit.",
    ],
    missingInfo: ["Aidez-vous un proche au quotidien ?"],
  };
}

export const aidantDefinitions: AidDefinition[] = [
  {
    aid: {
      id: "aidant",
      name: "Droits du proche aidant (AJPA, répit)",
      shortName: "Proche aidant",
      category: "aidant",
      scope: { level: "national" },
      authority: "CAF / MSA (AJPA) et conseil départemental (répit)",
      impact: "moyen",
      valueStatement: "Pour vous qui aidez un proche : un congé indemnisé et des solutions pour souffler.",
      description:
        "L'allocation journalière du proche aidant (AJPA) indemnise les jours où vous réduisez votre activité ; le droit au répit finance des relais.",
      whyOftenMissed: "Les aidants pensent rarement à leurs propres droits, alors qu'ils s'épuisent.",
      source: {
        label: "pour-les-personnes-agees.gouv.fr : solutions pour les aidants",
        url: "https://www.pour-les-personnes-agees.gouv.fr/",
      },
      howToApply: {
        organism: "La CAF ou la MSA (AJPA) ; le département pour le répit (via l'APA du proche)",
        url: "https://www.pour-les-personnes-agees.gouv.fr/",
        sentenceToSay:
          "J'aide un proche : je voudrais l'allocation journalière du proche aidant et des solutions de répit.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateAidant,
  },
];
