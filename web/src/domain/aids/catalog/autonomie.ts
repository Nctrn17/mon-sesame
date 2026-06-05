import { ACTION_SOCIALE_CARSAT, APA } from "@/domain/aids/baremes";
import type { AidDefinition } from "@/domain/aids/types";
import type { AidVerdict, EvalContext } from "@/domain/eligibility/types";
import { suggestsHeavyDependence, suggestsLightDependence } from "./helpers";

function evaluateApa(ctx: EvalContext): AidVerdict {
  const { age, profile } = ctx;
  if (age == null) {
    return { status: "unknown", explanation: ["Indiquez votre date de naissance."] };
  }
  if (profile.housing === "etablissement") {
    return {
      status: "not_eligible",
      explanation: ["En établissement, c'est l'APA en établissement qui s'applique (voir ci-dessous)."],
    };
  }
  if (age < APA.ageMin) {
    return {
      status: "not_eligible",
      explanation: [`L'APA est accessible à partir de ${APA.ageMin} ans.`],
    };
  }
  if (profile.autonomy === undefined) {
    return {
      status: "unknown",
      explanation: ["Indiquez votre besoin d'aide au quotidien pour vérifier l'APA."],
    };
  }
  if (suggestsHeavyDependence(profile)) {
    return {
      status: "eligible",
      explanation: [
        "Dès 60 ans, en cas de perte d'autonomie, l'APA finance l'aide à domicile, des repas, des aides techniques.",
        "Point clé : l'APA n'a PAS de plafond de ressources. Vos revenus ne changent que votre participation, jamais votre droit.",
      ],
      missingInfo: ["Une évaluation du degré d'autonomie (GIR) par le département fixera le montant."],
    };
  }
  if (suggestsLightDependence(profile)) {
    return {
      status: "to_check",
      explanation: [
        "Un besoin d'aide occasionnel correspond souvent à une autonomie encore bonne (GIR 5-6), plutôt couverte par l'action sociale de votre caisse de retraite ou l'aide-ménagère du département (voir ci-dessous).",
      ],
    };
  }
  return {
    status: "not_eligible",
    explanation: ["L'APA suppose une perte d'autonomie. Vous indiquez ne pas avoir besoin d'aide au quotidien."],
  };
}

function evaluateApaEtablissement(ctx: EvalContext): AidVerdict {
  const { age, profile } = ctx;
  if (age == null) {
    return { status: "unknown", explanation: ["Indiquez votre date de naissance."] };
  }
  if (profile.housing === undefined) {
    return { status: "unknown", explanation: ["Indiquez votre situation de logement."] };
  }
  if (profile.housing !== "etablissement") {
    return {
      status: "not_eligible",
      explanation: ["Cette aide concerne les personnes vivant en EHPAD ou en établissement."],
    };
  }
  if (age < APA.ageMin) {
    return { status: "not_eligible", explanation: [`L'APA est accessible à partir de ${APA.ageMin} ans.`] };
  }
  if (profile.autonomy === undefined) {
    return { status: "unknown", explanation: ["Indiquez votre besoin d'aide au quotidien."] };
  }
  if (suggestsHeavyDependence(profile)) {
    return {
      status: "eligible",
      explanation: [
        "En établissement, l'APA réduit le tarif dépendance facturé par l'EHPAD, selon votre degré d'autonomie.",
        "Sans condition de ressources pour le droit ; seule la participation varie.",
      ],
      missingInfo: ["Le GIR est évalué par l'équipe de l'établissement."],
    };
  }
  return {
    status: "to_check",
    explanation: ["Selon votre degré d'autonomie (GIR), évalué par l'établissement, l'APA peut réduire le tarif dépendance."],
  };
}

function evaluateAideMenagereDepartementale(ctx: EvalContext): AidVerdict {
  const { age, profile } = ctx;
  if (age == null) {
    return { status: "unknown", explanation: ["Indiquez votre date de naissance."] };
  }
  if (profile.housing === "etablissement") {
    return { status: "not_eligible", explanation: ["Cette aide concerne le maintien à domicile."] };
  }
  if (age < 65) {
    return {
      status: "not_eligible",
      explanation: ["L'aide-ménagère du département est accessible à partir de 65 ans (60 ans en cas d'inaptitude)."],
    };
  }
  if (profile.autonomy === undefined) {
    return { status: "unknown", explanation: ["Indiquez votre besoin d'aide au quotidien."] };
  }
  if (suggestsHeavyDependence(profile)) {
    return {
      status: "to_check",
      explanation: ["Avec une perte d'autonomie marquée, c'est plutôt l'APA qui s'applique (voir ci-dessus)."],
    };
  }
  if (profile.taxStatus === "imposable") {
    return {
      status: "not_eligible",
      explanation: ["L'aide-ménagère du département vise les faibles ressources ; vos revenus dépassent a priori le plafond."],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "Pour les personnes âgées autonomes (GIR 5-6) à faibles ressources qui n'ont pas l'APA, le département peut financer des heures d'aide à domicile.",
      "Elle ne se cumule pas avec l'APA et peut faire l'objet d'une récupération sur succession.",
    ],
    missingInfo: ["Vos ressources précises."],
  };
}

function evaluateActionSocialeCarsat(ctx: EvalContext): AidVerdict {
  const { age, profile } = ctx;
  if (age == null) {
    return { status: "unknown", explanation: ["Indiquez votre date de naissance."] };
  }
  if (age < 60) {
    return { status: "not_eligible", explanation: ["Cette aide s'adresse aux retraités."] };
  }
  if (suggestsHeavyDependence(profile)) {
    return {
      status: "to_check",
      explanation: ["Avec une perte d'autonomie marquée, c'est plutôt l'APA (ci-dessus) qui s'applique."],
    };
  }

  const schemeNote =
    profile.scheme === "fonction_publique"
      ? "Vous avez travaillé dans le public : renseignez-vous auprès de votre service des retraites de l'État ou de votre caisse (CNRACL)."
      : profile.scheme === "agricole"
        ? "Pour le régime agricole, adressez-vous à votre MSA."
        : profile.scheme === "mixte"
          ? "Avec une carrière mixte (privé et public), sollicitez chacune de vos caisses : la CARSAT gère souvent le volet privé."
          : "Pour le régime général (privé), c'est votre CARSAT.";

  return {
    status: "to_check",
    explanation: [
      "Votre caisse de retraite propose, pour les retraités encore autonomes, une aide à domicile, du ménage, des courses, un kit prévention ou une aide après hospitalisation.",
      "C'est l'une des aides les plus ignorées : il suffit d'en faire la demande pour une évaluation à domicile.",
      schemeNote,
    ],
    missingInfo: ["Vos ressources, dont dépend votre participation."],
  };
}

function evaluateTeleassistance(ctx: EvalContext): AidVerdict {
  const { age, profile } = ctx;
  if (age == null) {
    return { status: "unknown", explanation: ["Indiquez votre date de naissance."] };
  }
  if (profile.housing === "etablissement") {
    return { status: "not_eligible", explanation: ["La téléassistance concerne les personnes qui vivent à domicile."] };
  }
  const relevant =
    profile.maritalSituation === "seul" ||
    profile.autonomy === "parfois" ||
    profile.autonomy === "souvent" ||
    profile.autonomy === "quotidien" ||
    profile.disability === true ||
    profile.usesHomeHelp === true;

  if (!relevant) {
    return {
      status: "not_eligible",
      explanation: ["La téléassistance est surtout utile si vous vivez seul(e) ou avez un besoin de sécurité."],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "Un boîtier ou un médaillon pour alerter des secours en cas de chute ou de malaise, 24h/24.",
      "Souvent subventionnée par le département, le CCAS ou votre caisse de retraite, et éligible au crédit d'impôt.",
    ],
    missingInfo: ["Les offres et aides varient selon votre commune et votre département."],
  };
}

function evaluateArdh(ctx: EvalContext): AidVerdict {
  const { age, profile } = ctx;
  if (age == null) {
    return { status: "unknown", explanation: ["Indiquez votre date de naissance."] };
  }
  if (age < 60 || profile.housing === "etablissement") {
    return {
      status: "not_eligible",
      explanation: ["L'aide au retour à domicile après hospitalisation concerne les retraités rentrant chez eux."],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "Si vous rentrez (ou allez rentrer) d'une hospitalisation, votre caisse de retraite peut financer une aide temporaire à domicile : ménage, courses, portage de repas, aides techniques.",
      "À demander TRÈS VITE, idéalement avant la sortie, via l'assistante sociale de l'hôpital. La fenêtre est courte.",
    ],
    missingInfo: ["Avez-vous une hospitalisation récente ou prévue ?"],
  };
}

export const autonomieDefinitions: AidDefinition[] = [
  {
    aid: {
      id: "apa-domicile",
      name: "APA à domicile",
      shortName: "APA",
      category: "autonomie",
      scope: { level: "national" },
      authority: "Conseil départemental",
      impact: "eleve",
      valueStatement: "Finance l'aide pour rester chez vous : ménage, repas, toilette, aides techniques.",
      description:
        "L'allocation personnalisée d'autonomie finance l'aide nécessaire pour continuer à vivre chez soi malgré une perte d'autonomie, dès 60 ans.",
      whyOftenMissed: "Beaucoup renoncent en se croyant trop aisés : c'est faux, l'APA n'a pas de plafond de ressources.",
      source: { label: "pour-les-personnes-agees.gouv.fr : APA à domicile", url: APA.source.url },
      howToApply: {
        organism: "Le conseil départemental de votre lieu de résidence",
        url: APA.source.url,
        sentenceToSay: "Je souhaite déposer une demande d'APA à domicile et obtenir une évaluation de mon autonomie.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateApa,
  },
  {
    aid: {
      id: "apa-etablissement",
      name: "APA en établissement (EHPAD)",
      shortName: "APA établissement",
      category: "autonomie",
      scope: { level: "national" },
      authority: "Conseil départemental",
      impact: "eleve",
      valueStatement: "Réduit le tarif dépendance facturé par votre EHPAD.",
      description: "L'APA prend en charge une partie du tarif dépendance de l'établissement, selon le degré d'autonomie.",
      whyOftenMissed: "Souvent confondue avec l'APA à domicile ; les familles ignorent qu'elle réduit la facture de l'EHPAD.",
      source: {
        label: "pour-les-personnes-agees.gouv.fr : aides en EHPAD",
        url: "https://www.pour-les-personnes-agees.gouv.fr/",
      },
      howToApply: {
        organism: "Le conseil départemental, souvent via l'établissement",
        url: "https://www.pour-les-personnes-agees.gouv.fr/",
        sentenceToSay: "Je souhaite faire valoir l'APA pour réduire le tarif dépendance de l'établissement.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateApaEtablissement,
  },
  {
    aid: {
      id: "aide-menagere-departement",
      name: "Aide-ménagère du département",
      shortName: "Aide-ménagère (département)",
      category: "autonomie",
      scope: { level: "national" },
      authority: "Conseil départemental (aide sociale légale)",
      impact: "moyen",
      valueStatement: "Des heures d'aide à domicile financées par le département, si vous n'avez pas l'APA.",
      description:
        "Pour les personnes âgées encore autonomes (GIR 5-6) à faibles ressources, non bénéficiaires de l'APA.",
      whyOftenMissed: "Très méconnue, distincte de l'APA et de l'action sociale des caisses de retraite.",
      source: { label: "service-public.fr : aides aux personnes âgées", url: "https://www.service-public.fr/particuliers/vosdroits/N392" },
      howToApply: {
        organism: "Le CCAS de votre commune ou le conseil départemental",
        url: "https://www.service-public.fr/particuliers/vosdroits/N392",
        sentenceToSay: "Je voudrais demander l'aide-ménagère au titre de l'aide sociale départementale.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateAideMenagereDepartementale,
  },
  {
    aid: {
      id: "action-sociale-retraite",
      name: "Aide à domicile de votre caisse de retraite",
      shortName: "Action sociale retraite",
      category: "caisse_retraite",
      scope: { level: "national" },
      authority: "CARSAT / Cnav, MSA ou Agirc-Arrco selon votre régime",
      impact: "moyen",
      valueStatement:
        "Une aide à domicile financée par votre caisse de retraite : ménage, courses, prévention.",
      description:
        "Pour les retraités encore autonomes (GIR 5-6) : aide à domicile, ménage, courses, kit prévention, aide au retour après hospitalisation.",
      whyOftenMissed: "L'action sociale des caisses de retraite est massivement sous-utilisée : presque personne ne sait qu'elle existe.",
      source: { label: "lassuranceretraite.fr : bien vieillir chez soi", url: ACTION_SOCIALE_CARSAT.source.url },
      howToApply: {
        organism:
          "Votre caisse de retraite principale (CARSAT pour le privé, votre administration pour le public)",
        url: ACTION_SOCIALE_CARSAT.source.url,
        sentenceToSay:
          "Je suis retraité(e) et je voudrais une évaluation à domicile au titre de votre action sociale (aide au bien vieillir).",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateActionSocialeCarsat,
  },
  {
    aid: {
      id: "teleassistance",
      name: "Téléassistance",
      category: "autonomie",
      scope: { level: "national" },
      authority: "Département, CCAS ou caisse de retraite (selon votre commune)",
      impact: "coup_de_pouce",
      valueStatement: "Être secouru(e) rapidement en cas de chute ou de malaise, jour et nuit.",
      description:
        "Un dispositif d'alerte (boîtier ou médaillon) relié à une plateforme d'assistance, souvent subventionné.",
      whyOftenMissed: "Très actionnable mais rarement présentée comme un droit ; les aides locales sont peu connues.",
      source: {
        label: "pour-les-personnes-agees.gouv.fr : téléassistance",
        url: "https://www.pour-les-personnes-agees.gouv.fr/",
      },
      howToApply: {
        organism: "Le CCAS de votre commune ou le conseil départemental",
        url: "https://www.pour-les-personnes-agees.gouv.fr/",
        sentenceToSay: "Je voudrais installer une téléassistance et connaître les aides pour la financer.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateTeleassistance,
  },
  {
    aid: {
      id: "ardh",
      name: "Aide au retour à domicile après hospitalisation",
      shortName: "Retour après hospitalisation",
      category: "caisse_retraite",
      scope: { level: "national" },
      authority: "Votre caisse de retraite (CARSAT / Cnav)",
      impact: "moyen",
      valueStatement: "Une aide temporaire à domicile après un séjour à l'hôpital, pour bien récupérer.",
      description: "Aide-ménagère, courses, portage de repas et aides techniques pendant quelques semaines après l'hospitalisation.",
      whyOftenMissed: "La demande doit se faire très vite (souvent avant la sortie d'hôpital) : beaucoup l'apprennent trop tard.",
      source: {
        label: "pour-les-personnes-agees.gouv.fr : sortie d'hospitalisation",
        url: "https://www.pour-les-personnes-agees.gouv.fr/",
      },
      howToApply: {
        organism: "L'assistante sociale de l'hôpital ou votre caisse de retraite",
        sentenceToSay: "Je voudrais une aide au retour à domicile après mon hospitalisation.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateArdh,
  },
];
