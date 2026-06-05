import { MAPRIMEADAPT, formatEuros } from "@/domain/aids/baremes";
import type { AidDefinition } from "@/domain/aids/types";
import type { AidVerdict, EvalContext } from "@/domain/eligibility/types";
import { suggestsHeavyDependence } from "./helpers";

function evaluateMaPrimeAdapt(ctx: EvalContext): AidVerdict {
  const { age, profile } = ctx;
  if (age == null) {
    return { status: "unknown", explanation: ["Indiquez votre date de naissance."] };
  }

  if (profile.housing === undefined) {
    return {
      status: "unknown",
      explanation: ["Indiquez votre situation de logement pour vérifier MaPrimeAdapt'."],
    };
  }
  const housingOk = profile.housing === "proprietaire" || profile.housing === "locataire";
  if (!housingOk) {
    return {
      status: "not_eligible",
      explanation: [
        "MaPrimeAdapt' finance des travaux dans votre logement (propriétaire occupant, ou locataire avec l'accord du propriétaire).",
      ],
    };
  }

  const ageOk =
    age >= MAPRIMEADAPT.ageSansConditionAutonomie ||
    (age >= MAPRIMEADAPT.ageMinAvecGir && suggestsHeavyDependence(profile)) ||
    !!profile.disability;

  if (!ageOk) {
    return {
      status: "to_check",
      explanation: [
        `MaPrimeAdapt' est ouverte dès ${MAPRIMEADAPT.ageSansConditionAutonomie} ans sans autre condition, ou dès ${MAPRIMEADAPT.ageMinAvecGir} ans en cas de perte d'autonomie ou de handicap.`,
      ],
    };
  }

  if (profile.taxStatus === "imposable") {
    return {
      status: "to_check",
      explanation: ["MaPrimeAdapt' vise les revenus modestes et très modestes : vérifiez votre niveau de ressources."],
      missingInfo: ["Votre revenu fiscal de référence."],
    };
  }

  const taux = MAPRIMEADAPT.tauxTresModeste;
  const aideMax = MAPRIMEADAPT.plafondTravaux * taux;
  return {
    status: "eligible",
    explanation: [
      "Vous pouvez adapter votre logement au vieillissement : douche de plain-pied, barres d'appui, monte-escalier, sol antidérapant.",
      `L'aide couvre jusqu'à ${Math.round(taux * 100)} % des travaux (plafond de ${formatEuros(MAPRIMEADAPT.plafondTravaux)}), soit jusqu'à ${formatEuros(aideMax)} d'aide.`,
    ],
    missingInfo: ["Un accompagnement (AMO) confirmera le montant selon vos travaux et vos ressources."],
  };
}

function evaluateApl(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.housing === undefined) {
    return { status: "unknown", explanation: ["Indiquez votre situation de logement."] };
  }
  if (profile.housing !== "locataire" && profile.housing !== "etablissement") {
    return {
      status: "not_eligible",
      explanation: [
        "L'aide au logement concerne les locataires et les résidents qui paient un loyer ou un tarif d'hébergement.",
      ],
    };
  }
  if (profile.taxStatus === "non_imposable") {
    return {
      status: "eligible",
      explanation: [
        "Vos revenus modestes et votre loyer ouvrent a priori droit à une aide au logement.",
        "Elle s'applique aussi au tarif d'hébergement en résidence autonomie ou en EHPAD.",
      ],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "L'aide au logement dépend de votre loyer et de vos revenus.",
      "Beaucoup de locataires retraités y ont droit sans le savoir, surtout une fois les revenus en baisse.",
    ],
    missingInfo: ["Le montant de votre loyer et de vos ressources."],
  };
}

function evaluateAsh(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.housing === undefined) {
    return { status: "unknown", explanation: ["Indiquez votre situation de logement."] };
  }
  if (profile.housing !== "etablissement") {
    return {
      status: "not_eligible",
      explanation: ["L'aide sociale à l'hébergement concerne les personnes vivant en établissement (EHPAD, résidence)."],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "Si vos ressources ne suffisent pas à payer l'établissement, le département peut prendre en charge une partie du tarif.",
      "À demander auprès du département ; une récupération sur succession est possible.",
    ],
    missingInfo: ["Le tarif de l'établissement et vos ressources."],
  };
}

function evaluateMaPrimeRenov(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.housing === undefined) {
    return { status: "unknown", explanation: ["Indiquez votre situation de logement."] };
  }
  if (profile.housing !== "proprietaire") {
    return {
      status: "not_eligible",
      explanation: ["MaPrimeRénov' s'adresse aux propriétaires qui font des travaux d'économie d'énergie."],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "Si vous envisagez des travaux d'économie d'énergie (chauffage, isolation), MaPrimeRénov' en finance une partie.",
      "Plus vos revenus sont modestes, plus l'aide est élevée.",
    ],
    missingInfo: ["La nature de vos travaux et vos ressources."],
  };
}

function evaluateActionLogement(ctx: EvalContext): AidVerdict {
  const { age, profile } = ctx;
  if (age == null) {
    return { status: "unknown", explanation: ["Indiquez votre date de naissance."] };
  }
  if (profile.housing === "etablissement") {
    return { status: "not_eligible", explanation: ["Cette aide concerne l'adaptation d'un logement personnel."] };
  }
  const eligibleProfil = age >= 70 || suggestsHeavyDependence(profile) || profile.disability === true;
  if (!eligibleProfil) {
    return {
      status: "to_check",
      explanation: ["Action Logement aide l'adaptation du logement dès 70 ans, ou en cas de perte d'autonomie."],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "Action Logement finance l'adaptation de la salle de bain (douche de plain-pied...) : une subvention, plus un prêt à taux zéro pour le reste.",
      "Ouvert aux salariés ET aux retraités du privé, sous conditions de ressources, et cumulable avec MaPrimeAdapt'.",
    ],
    missingInfo: ["Avez-vous (eu) une carrière dans le privé et des ressources modestes ?"],
  };
}

function evaluateFsl(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.taxStatus === "imposable") {
    return {
      status: "not_eligible",
      explanation: ["Le Fonds de solidarité logement vise les ménages en difficulté financière."],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "En cas d'impayé ou de difficulté à payer le loyer, l'électricité, le gaz ou l'eau, le Fonds de solidarité logement (FSL) peut vous aider (subvention ou prêt à 0%).",
      "Il peut intervenir dès le premier impayé. Passez par une assistante sociale ou le CCAS. Le barème varie selon votre département.",
    ],
    missingInfo: ["Avez-vous des difficultés à payer votre logement ou vos factures ?"],
  };
}

export const logementDefinitions: AidDefinition[] = [
  {
    aid: {
      id: "apl",
      name: "Aide au logement (APL / ALS)",
      shortName: "Aide au logement",
      category: "logement",
      scope: { level: "national" },
      authority: "CAF ou MSA",
      impact: "eleve",
      valueStatement: "Réduit votre loyer chaque mois (ou le tarif de votre établissement).",
      description:
        "Une aide mensuelle pour payer votre loyer si vous êtes locataire, ou le tarif d'hébergement en résidence ou en EHPAD.",
      whyOftenMissed:
        "De nombreux locataires retraités, et des résidents d'EHPAD, ignorent qu'ils y ont droit. La demande est à faire à la CAF.",
      source: { label: "caf.fr : aides au logement", url: "https://www.caf.fr/" },
      howToApply: {
        organism: "La CAF (ou la MSA pour le régime agricole), sur caf.fr",
        url: "https://www.caf.fr/",
        sentenceToSay: "Je voudrais faire une demande d'aide au logement.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateApl,
  },
  {
    aid: {
      id: "maprimeadapt",
      name: "MaPrimeAdapt'",
      category: "logement",
      scope: { level: "national" },
      authority: "Anah (Agence nationale de l'habitat)",
      impact: "eleve",
      valueStatement:
        "Finance vos travaux pour un logement plus sûr : douche de plain-pied, barres d'appui, monte-escalier.",
      description: "Une aide pour adapter votre logement au vieillissement et continuer à y vivre en sécurité.",
      whyOftenMissed: "Aide récente (2024) encore peu connue, ouverte dès 70 ans même sans perte d'autonomie.",
      source: { label: "france-renov.gouv.fr : MaPrimeAdapt'", url: "https://france-renov.gouv.fr/aides/maprimeadapt" },
      howToApply: {
        organism: "France Rénov' / Anah (un accompagnateur AMO vous suit)",
        url: "https://france-renov.gouv.fr/aides/maprimeadapt",
        sentenceToSay: "Je voudrais bénéficier de MaPrimeAdapt' pour adapter mon logement.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateMaPrimeAdapt,
  },
  {
    aid: {
      id: "ash",
      name: "Aide sociale à l'hébergement (ASH)",
      shortName: "ASH",
      category: "logement",
      scope: { level: "national" },
      authority: "Conseil départemental",
      impact: "eleve",
      valueStatement: "Prend en charge une partie du tarif de l'établissement si vos ressources ne suffisent pas.",
      description:
        "Pour les personnes en EHPAD ou résidence dont les revenus ne couvrent pas le coût de l'hébergement.",
      whyOftenMissed:
        "Méconnue et freinée par la récupération sur succession, alors qu'elle évite des situations d'impayés.",
      source: {
        label: "pour-les-personnes-agees.gouv.fr : ASH",
        url: "https://www.pour-les-personnes-agees.gouv.fr/",
      },
      howToApply: {
        organism: "Le CCAS de votre commune ou le conseil départemental",
        url: "https://www.pour-les-personnes-agees.gouv.fr/",
        sentenceToSay: "Je souhaite demander l'aide sociale à l'hébergement.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateAsh,
  },
  {
    aid: {
      id: "maprimerenov",
      name: "MaPrimeRénov' (rénovation énergétique)",
      shortName: "MaPrimeRénov'",
      category: "logement",
      scope: { level: "national" },
      authority: "Anah",
      impact: "moyen",
      valueStatement: "Finance vos travaux d'économie d'énergie (chauffage, isolation).",
      description: "Une aide pour rénover votre logement et réduire vos factures d'énergie.",
      whyOftenMissed: "Les retraités modestes bénéficient des aides les plus élevées mais n'engagent pas les travaux.",
      source: { label: "france-renov.gouv.fr : MaPrimeRénov'", url: "https://france-renov.gouv.fr/aides/maprimerenov" },
      howToApply: {
        organism: "France Rénov' (conseil gratuit) puis Anah",
        url: "https://france-renov.gouv.fr/aides/maprimerenov",
        sentenceToSay: "Je voudrais des conseils et une aide pour des travaux d'économie d'énergie.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateMaPrimeRenov,
  },
  {
    aid: {
      id: "action-logement-adaptation",
      name: "Action Logement, adaptation du logement",
      shortName: "Action Logement",
      category: "logement",
      scope: { level: "national" },
      authority: "Action Logement",
      impact: "eleve",
      valueStatement: "Une subvention (et un prêt à 0%) pour adapter votre salle de bain au vieillissement.",
      description: "Aide à l'adaptation du logement, ouverte aux salariés comme aux retraités du privé, cumulable avec MaPrimeAdapt'.",
      whyOftenMissed: "Les retraités ignorent qu'Action Logement reste ouvert aux anciens salariés du privé, pas seulement aux actifs.",
      source: { label: "actionlogement.fr : logement des seniors", url: "https://www.actionlogement.fr/jusqu-5-000-pour-le-logement-des-seniors" },
      howToApply: {
        organism: "Action Logement",
        url: "https://www.actionlogement.fr/jusqu-5-000-pour-le-logement-des-seniors",
        sentenceToSay: "Je voudrais l'aide à l'adaptation du logement pour les seniors.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateActionLogement,
  },
  {
    aid: {
      id: "fsl",
      name: "Fonds de solidarité logement (FSL)",
      shortName: "FSL",
      category: "logement",
      scope: { level: "national" },
      authority: "Conseil départemental",
      impact: "moyen",
      valueStatement: "Une aide en cas d'impayé ou de difficulté à payer le loyer, l'énergie ou l'eau.",
      description: "Subvention ou prêt à 0% pour le maintien dans le logement, dès le premier impayé.",
      whyOftenMissed: "Beaucoup ignorent qu'il couvre aussi l'énergie et l'eau, pas seulement le loyer.",
      source: { label: "service-public.fr : FSL", url: "https://www.service-public.fr/particuliers/vosdroits/F1334" },
      howToApply: {
        organism: "Le CCAS ou le service social du département",
        url: "https://www.service-public.fr/particuliers/vosdroits/F1334",
        sentenceToSay: "J'ai du mal à payer mon logement, puis-je avoir une aide du FSL ?",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateFsl,
  },
];
