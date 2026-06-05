import type { AidDefinition } from "@/domain/aids/types";
import type { AidVerdict, EvalContext } from "@/domain/eligibility/types";

const AGE_MIN = 60;

function evaluateSncfSenior(ctx: EvalContext): AidVerdict {
  const { age } = ctx;
  if (age == null) {
    return { status: "unknown", explanation: ["Indiquez votre date de naissance."] };
  }
  if (age < AGE_MIN) {
    return {
      status: "not_eligible",
      explanation: [`La carte Avantage Senior est accessible à partir de ${AGE_MIN} ans.`],
    };
  }
  return {
    status: "eligible",
    explanation: [
      `Dès ${AGE_MIN} ans, la carte Avantage Senior de la SNCF donne jusqu'à 30 % de réduction sur les trains, partout en France.`,
      "Elle est payante (environ 49 € par an) mais vite rentabilisée si vous voyagez en train.",
    ],
  };
}

export const transportNationalDefinitions: AidDefinition[] = [
  {
    aid: {
      id: "sncf-senior",
      name: "Carte Avantage Senior (SNCF)",
      shortName: "Carte SNCF Senior",
      category: "transport",
      scope: { level: "national" },
      authority: "SNCF (avantage commercial)",
      impact: "coup_de_pouce",
      valueStatement: "Jusqu'à 30 % de réduction sur les trains (TGV, Intercités), partout en France.",
      description: "Une carte de réduction pour les voyageurs de 60 ans et plus, avec des prix plafonnés.",
      whyOftenMissed: "Avantage simple mais sous-exploité, notamment pour les trajets familiaux.",
      source: { label: "sncf-connect.com : carte Avantage Senior", url: "https://www.sncf-connect.com/" },
      howToApply: {
        organism: "SNCF Connect (en ligne ou en gare)",
        url: "https://www.sncf-connect.com/",
        sentenceToSay: "Je voudrais acheter la carte Avantage Senior.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateSncfSenior,
  },
];
