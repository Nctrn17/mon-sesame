import { IDF, TRANSPORT_IDF, formatEuros } from "@/domain/aids/baremes";
import type { AidDefinition } from "@/domain/aids/types";
import type { AidVerdict, EvalContext } from "@/domain/eligibility/types";
import { yearsSinceAge } from "./helpers";

function evaluateAmethyste(ctx: EvalContext): AidVerdict {
  const { age, profile } = ctx;
  if (age == null) {
    return { status: "unknown", explanation: ["Indiquez votre date de naissance."] };
  }

  const ageOk = age >= TRANSPORT_IDF.ageAmethyste || !!profile.disability;
  if (!ageOk) {
    return {
      status: "not_eligible",
      explanation: [
        `Le forfait Améthyste est accessible dès ${TRANSPORT_IDF.ageAmethyste} ans pour les retraités sans activité (et sans condition d'âge en cas de handicap).`,
      ],
    };
  }

  if (profile.taxStatus === "imposable") {
    return {
      status: "to_check",
      explanation: [
        "La plupart des départements franciliens réservent le forfait Améthyste aux personnes non imposables, et les règles varient selon le département.",
        "Le Navigo Senior reste accessible sans condition de ressources (voir ci-dessous).",
      ],
    };
  }

  const dept = profile.commune?.codeDepartement;
  const yearsEligible = yearsSinceAge(age, TRANSPORT_IDF.ageAmethyste);
  const retro = yearsEligible * TRANSPORT_IDF.valeurAnnuelleNavigo;
  const deptNote =
    dept === "75"
      ? "À Paris, le forfait est gratuit pour les seniors éligibles."
      : "Selon votre département, le forfait est gratuit ou avec une participation modérée.";

  return {
    status: "eligible",
    estimatedAnnualAmount: TRANSPORT_IDF.valeurAnnuelleNavigo,
    estimatedAmountLabel: `≈ ${formatEuros(TRANSPORT_IDF.valeurAnnuelleNavigo)} / an d'économie`,
    retroactiveEstimate: retro,
    explanation: [
      `Dès ${TRANSPORT_IDF.ageAmethyste} ans, en tant que retraité non imposable, vous pouvez voyager gratuitement ou à prix très réduit dans les transports d'Île-de-France.`,
      deptNote,
      "C'est typiquement le droit qu'on découvre trop tard : il se demande au conseil départemental ou au CCAS, jamais au guichet du transporteur.",
    ],
  };
}

function evaluateNavigoSenior(ctx: EvalContext): AidVerdict {
  const { age, profile } = ctx;
  if (age == null) {
    return { status: "unknown", explanation: ["Indiquez votre date de naissance."] };
  }
  if (age < TRANSPORT_IDF.ageNavigoSenior) {
    return {
      status: "not_eligible",
      explanation: [`Le forfait Navigo Senior est accessible à partir de ${TRANSPORT_IDF.ageNavigoSenior} ans.`],
    };
  }

  // Évite le double comptage : si le forfait Améthyste (souvent gratuit) est
  // probable, le Navigo Senior n'est qu'une solution de repli.
  const amethysteLikely =
    (age >= TRANSPORT_IDF.ageAmethyste || !!profile.disability) &&
    profile.taxStatus === "non_imposable";

  if (amethysteLikely) {
    return {
      status: "to_check",
      explanation: [
        "Vous avez droit au forfait Améthyste (souvent gratuit), généralement plus avantageux.",
        "Le Navigo Senior reste une solution de repli à tarif réduit, sans condition de ressources.",
      ],
    };
  }

  const yearsEligible = yearsSinceAge(age, TRANSPORT_IDF.ageNavigoSenior);
  return {
    status: "eligible",
    estimatedAnnualAmount: TRANSPORT_IDF.economieNavigoSenior,
    estimatedAmountLabel: `≈ ${formatEuros(TRANSPORT_IDF.economieNavigoSenior)} / an d'économie`,
    retroactiveEstimate: yearsEligible * TRANSPORT_IDF.economieNavigoSenior,
    explanation: [
      `Dès ${TRANSPORT_IDF.ageNavigoSenior} ans, sans condition de ressources, vous bénéficiez d'un forfait Navigo à tarif réduit (environ moitié prix) dans toute l'Île-de-France.`,
      "Beaucoup de seniors ignorent simplement qu'il existe.",
    ],
  };
}


function evaluateSolidariteTransport(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;

  if (profile.taxStatus === "imposable") {
    return {
      status: "not_eligible",
      explanation: [
        "La tarification Solidarité Transport est réservée aux personnes percevant certaines aides sous condition de ressources (Complémentaire santé solidaire, RSA...).",
      ],
    };
  }

  return {
    status: "to_check",
    explanation: [
      "Si vous bénéficiez de la Complémentaire santé solidaire (ou du RSA), vous avez droit à une réduction de 50 % à 75 % sur les tickets et le forfait Navigo, dans toute l'Île-de-France.",
      "Si vous avez droit au forfait Améthyste ou au Navigo Senior, comparez : selon votre situation, l'un des trois est plus avantageux.",
    ],
    missingInfo: ["Bénéficiez-vous de la Complémentaire santé solidaire ou du RSA ?"],
  };
}

export const transportIdfDefinitions: AidDefinition[] = [
  {
    aid: {
      id: "amethyste-idf",
      name: "Forfait Améthyste (transport gratuit ou réduit)",
      shortName: "Améthyste",
      category: "transport",
      scope: { level: "region", code: IDF.regionCode },
      authority: "Votre conseil départemental + Île-de-France Mobilités",
      impact: "eleve",
      valueStatement: "Les transports en commun gratuits ou presque, partout en Île-de-France.",
      description:
        "Transports en commun gratuits ou à prix très réduit en Île-de-France pour les retraités modestes et les personnes handicapées.",
      whyOftenMissed:
        "Jamais attribué d'office, financé par le département (pas par le transporteur), et en pleine évolution selon les départements. C'est le droit qui a inspiré ce service.",
      source: TRANSPORT_IDF.source,
      howToApply: {
        organism: "Votre conseil départemental ou le CCAS de votre commune",
        url: TRANSPORT_IDF.source.url,
        steps: [
          "Procurez-vous une carte Navigo personnalisée.",
          "Déposez un dossier auprès du conseil départemental ou du CCAS.",
          "Une fois accepté, le forfait est chargé sur votre carte.",
        ],
        sentenceToSay:
          "Je suis retraité(e) non imposable et je voudrais demander le forfait Améthyste pour les transports.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateAmethyste,
  },
  {
    aid: {
      id: "navigo-senior-idf",
      name: "Forfait Navigo Senior",
      shortName: "Navigo Senior",
      category: "transport",
      scope: { level: "region", code: IDF.regionCode },
      authority: "Île-de-France Mobilités",
      impact: "moyen",
      valueStatement: "Le forfait Navigo à moitié prix, partout en Île-de-France.",
      description:
        "Un forfait Navigo à tarif réduit (environ moitié prix), toutes zones, pour les Franciliens de 62 ans et plus sans activité, sans condition de ressources.",
      whyOftenMissed: "Peu de seniors savent qu'il existe, distinct du forfait Améthyste.",
      source: TRANSPORT_IDF.source,
      howToApply: {
        organism: "Île-de-France Mobilités (agences Navigo, en ligne)",
        url: TRANSPORT_IDF.source.url,
        sentenceToSay: "Je voudrais souscrire le forfait Navigo Senior.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateNavigoSenior,
  },
  {
    aid: {
      id: "solidarite-transport-idf",
      name: "Tarification Solidarité Transport (réduction 50 à 75 %)",
      shortName: "Solidarité Transport",
      category: "transport",
      scope: { level: "region", code: IDF.regionCode },
      authority: "Île-de-France Mobilités",
      impact: "moyen",
      valueStatement: "Tickets et forfait Navigo à moitié prix ou moins, quel que soit votre âge.",
      description:
        "Une réduction de 50 % à 75 % sur les transports d'Île-de-France pour les bénéficiaires de la Complémentaire santé solidaire ou du RSA, sans condition d'âge.",
      whyOftenMissed:
        "Le droit découle d'une autre aide (CSS, RSA) : personne ne pense à le réclamer au transporteur, et il faut le renouveler chaque année.",
      source: {
        label: "iledefrance-mobilites.fr : tarification Solidarité Transport",
        url: "https://www.iledefrance-mobilites.fr/titres-et-tarifs/aides-et-reductions",
      },
      howToApply: {
        organism: "Agence Solidarité Transport (en ligne ou par téléphone)",
        url: "https://www.solidaritetransport.fr/",
        sentenceToSay: "Je bénéficie de la Complémentaire santé solidaire et je voudrais activer la réduction Solidarité Transport sur mon passe Navigo.",
      },
      lastVerifiedAt: "2026-06-09",
    },
    evaluate: evaluateSolidariteTransport,
  },
];
