import type { AidDefinition } from "@/domain/aids/types";
import type { AidVerdict, EvalContext } from "@/domain/eligibility/types";
import { suggestsHeavyDependence } from "./helpers";

function evaluateCmi(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.disability === true) {
    return {
      status: "eligible",
      explanation: [
        "Votre reconnaissance de handicap ou d'invalidité ouvre a priori droit à une carte mobilité inclusion (CMI).",
        "Selon votre situation : stationnement réservé, priorité dans les files d'attente, réductions de transport, et entrée gratuite de nombreux musées.",
      ],
    };
  }
  if (suggestsHeavyDependence(profile)) {
    return {
      status: "to_check",
      explanation: ["En cas de perte d'autonomie, vous pouvez demander une carte mobilité inclusion lors de l'évaluation par le département (APA)."],
    };
  }
  if (profile.disability === undefined && profile.autonomy === undefined) {
    return { status: "unknown", explanation: ["Indiquez votre situation de handicap ou d'autonomie."] };
  }
  return {
    status: "not_eligible",
    explanation: ["La carte mobilité inclusion s'adresse aux personnes handicapées ou en perte d'autonomie."],
  };
}

function evaluateAahRetraite(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.disability === undefined) {
    return { status: "unknown", explanation: ["Indiquez si vous avez une reconnaissance de handicap."] };
  }
  if (!profile.disability) {
    return { status: "not_eligible", explanation: ["L'AAH concerne les personnes ayant un handicap reconnu."] };
  }
  return {
    status: "to_check",
    explanation: [
      "Si votre taux d'incapacité est d'au moins 80%, l'AAH peut être maintenue après 62 ans, en complément de votre retraite si celle-ci est faible.",
      "Beaucoup croient à tort que l'AAH s'arrête forcément à la retraite. À vérifier avec la CAF ou la MSA.",
    ],
    missingInfo: ["Votre taux d'incapacité et le montant de votre retraite."],
  };
}

function evaluatePch(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.disability === true || suggestsHeavyDependence(profile)) {
    return {
      status: "to_check",
      explanation: [
        "La prestation de compensation du handicap (PCH) finance l'aide humaine, les aides techniques et l'aménagement, sans participation selon les ressources comme l'APA.",
        "Après 60 ans, si votre handicap existait avant, vous avez un droit d'option : comparez PCH et APA et choisissez la plus avantageuse.",
      ],
      missingInfo: ["Votre handicap était-il reconnu avant 60 ans ? Demande à la MDPH."],
    };
  }
  if (profile.disability === undefined && profile.autonomy === undefined) {
    return { status: "unknown", explanation: ["Indiquez votre situation de handicap ou d'autonomie."] };
  }
  return {
    status: "not_eligible",
    explanation: ["La PCH s'adresse aux personnes en situation de handicap ou de forte perte d'autonomie."],
  };
}

function evaluateMtp(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.disability === undefined) {
    return { status: "unknown", explanation: ["Indiquez si vous avez une invalidité reconnue."] };
  }
  if (!profile.disability) {
    return { status: "not_eligible", explanation: ["Cette majoration concerne les titulaires d'une pension d'invalidité ayant besoin de l'aide d'un tiers."] };
  }
  return {
    status: "to_check",
    explanation: [
      "Si vous avez besoin de l'aide d'une autre personne pour les actes essentiels et que vous relevez d'une invalidité, vous pouvez demander la majoration pour tierce personne (non imposable).",
      "Point clé : au passage à la retraite, la demande se fait auprès de la caisse de retraite, c'est un moment où ce droit se perd souvent.",
    ],
    missingInfo: ["Avez-vous une pension d'invalidité et besoin d'aide pour les actes essentiels ?"],
  };
}

function evaluateTransportPmr(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.disability === true) {
    return {
      status: "eligible",
      explanation: [
        "Avec une carte mobilité inclusion « invalidité », vous pouvez vous inscrire au service de transport adapté de votre territoire (porte-à-porte).",
        "Le service porte des noms différents selon les villes (PAM, Mobibus...). Demandez-le à votre mairie ou intercommunalité.",
      ],
    };
  }
  if (suggestsHeavyDependence(profile)) {
    return {
      status: "to_check",
      explanation: ["En cas de mobilité réduite, un service de transport adapté existe souvent près de chez vous. Renseignez-vous auprès de votre commune."],
    };
  }
  return {
    status: "not_eligible",
    explanation: ["Le transport adapté s'adresse aux personnes à mobilité réduite ou handicapées."],
  };
}

export const handicapDefinitions: AidDefinition[] = [
  {
    aid: {
      id: "cmi",
      name: "Carte mobilité inclusion (CMI)",
      shortName: "CMI",
      category: "handicap",
      scope: { level: "national" },
      authority: "Conseil départemental (MDPH)",
      impact: "moyen",
      valueStatement: "Stationnement, priorité dans les files, réductions de transport et musées.",
      description: "Une carte qui facilite les déplacements et le quotidien des personnes handicapées ou en perte d'autonomie.",
      whyOftenMissed: "Souvent demandée trop tard ; les anciennes cartes doivent être converties en CMI avant fin 2026.",
      source: { label: "service-public.gouv.fr : CMI", url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F34049" },
      howToApply: {
        organism: "La MDPH ou le conseil départemental (avec la demande d'APA le cas échéant)",
        guichet: "clic",
        url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F34049",
        sentenceToSay: "Je souhaite demander une carte mobilité inclusion.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateCmi,
  },
  {
    aid: {
      id: "aah-retraite",
      name: "AAH maintenue à la retraite",
      shortName: "AAH",
      category: "handicap",
      scope: { level: "national" },
      authority: "CAF ou MSA",
      impact: "eleve",
      valueStatement: "L'allocation adulte handicapé peut continuer après 62 ans, en complément d'une petite retraite.",
      description: "Pour un taux d'incapacité d'au moins 80%, l'AAH se maintient et complète la pension.",
      whyOftenMissed: "Beaucoup croient que l'AAH s'arrête automatiquement au passage à la retraite.",
      source: { label: "service-public.gouv.fr : AAH", url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F12242" },
      howToApply: {
        organism: "La CAF ou la MSA",
        guichet: "caf",
        sentenceToSay: "Mon AAH peut-elle être maintenue avec ma retraite ?",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateAahRetraite,
  },
  {
    aid: {
      id: "pch",
      name: "Prestation de compensation du handicap (PCH)",
      shortName: "PCH",
      category: "handicap",
      scope: { level: "national" },
      authority: "Conseil départemental (MDPH)",
      impact: "eleve",
      valueStatement: "Finance l'aide humaine, les aides techniques et l'aménagement, souvent mieux que l'APA.",
      description: "Une compensation du handicap, avec un droit d'option PCH ou APA après 60 ans.",
      whyOftenMissed: "Les seniors ignorent qu'ils peuvent comparer PCH et APA et choisir la plus avantageuse.",
      source: { label: "service-public.gouv.fr : PCH", url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F14202" },
      howToApply: {
        organism: "La MDPH de votre département",
        guichet: "clic",
        sentenceToSay: "Je voudrais étudier la PCH et le droit d'option avec l'APA.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluatePch,
  },
  {
    aid: {
      id: "mtp",
      name: "Majoration pour tierce personne (MTP)",
      shortName: "MTP",
      category: "handicap",
      scope: { level: "national" },
      authority: "Assurance Maladie / caisse de retraite",
      impact: "eleve",
      valueStatement: "Un complément si vous avez besoin de l'aide d'une autre personne au quotidien (invalidité).",
      description: "Une majoration non imposable pour les personnes invalides nécessitant l'assistance d'un tiers.",
      whyOftenMissed: "Le droit se perd souvent au passage à la retraite, faute de le redemander à la caisse de retraite.",
      source: { label: "service-public.gouv.fr : MTP", url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F31434" },
      howToApply: {
        organism: "Votre CPAM, puis votre caisse de retraite après 60 ans",
        guichet: "cpam",
        sentenceToSay: "Ai-je droit à la majoration pour tierce personne ?",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateMtp,
  },
  {
    aid: {
      id: "transport-pmr",
      name: "Transport adapté (PMR)",
      shortName: "Transport adapté",
      category: "transport",
      scope: { level: "national" },
      authority: "Votre commune ou intercommunalité",
      impact: "moyen",
      valueStatement: "Un transport porte-à-porte si vous avez du mal à vous déplacer.",
      description: "Un service de transport pour les personnes à mobilité réduite, accessible avec une CMI invalidité.",
      whyOftenMissed: "Le service existe presque partout mais sous des noms locaux variés, peu identifiables.",
      source: { label: "monparcourshandicap.gouv.fr : mobilité", url: "https://www.monparcourshandicap.gouv.fr/" },
      howToApply: {
        organism: "Votre mairie ou intercommunalité (service de transport adapté)",
        guichet: "mairie",
        sentenceToSay: "Avez-vous un service de transport adapté pour les personnes à mobilité réduite ?",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateTransportPmr,
  },
];
