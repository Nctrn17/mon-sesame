import { ASPA, ASI, formatEuros } from "@/domain/aids/baremes";
import type { AidDefinition } from "@/domain/aids/types";
import type { AidVerdict, EvalContext } from "@/domain/eligibility/types";
import { lowIncomeLikely } from "./helpers";

function evaluateAspa(ctx: EvalContext): AidVerdict {
  const { age, profile } = ctx;
  if (age == null) {
    return {
      status: "unknown",
      explanation: ["Indiquez votre date de naissance pour vérifier la condition d'âge."],
    };
  }

  const ageOk =
    age >= ASPA.ageDroitCommun ||
    (age >= ASPA.ageInapteOuHandicap && !!profile.disability);

  if (!ageOk) {
    return {
      status: "not_eligible",
      explanation: [
        `L'ASPA s'ouvre à ${ASPA.ageDroitCommun} ans (ou ${ASPA.ageInapteOuHandicap} ans en cas d'inaptitude ou de handicap). Vous avez ${age} ans.`,
      ],
    };
  }

  if (profile.taxStatus === "imposable") {
    return {
      status: "not_eligible",
      explanation: [
        "L'ASPA est réservée aux revenus modestes. Comme vous êtes imposable, vos ressources dépassent a priori le plafond.",
      ],
    };
  }

  const plafondMensuel =
    profile.maritalSituation === "couple"
      ? ASPA.plafondMensuelCouple
      : ASPA.plafondMensuelSeul;

  if (lowIncomeLikely(profile.taxStatus)) {
    if (profile.monthlyIncome != null) {
      if (profile.monthlyIncome >= plafondMensuel) {
        return {
          status: "not_eligible",
          explanation: [
            `Avec ${formatEuros(profile.monthlyIncome)} / mois, vos ressources atteignent ou dépassent le plafond ASPA de ${formatEuros(plafondMensuel)} / mois pour votre foyer.`,
          ],
        };
      }
      const annuel = (plafondMensuel - profile.monthlyIncome) * 12;
      return {
        status: "eligible",
        estimatedAnnualAmount: annuel,
        estimatedAmountLabel: `≈ ${formatEuros(annuel)} / an`,
        explanation: [
          `Vous avez ${age} ans et des revenus modestes : les conditions sont a priori remplies.`,
          "L'ASPA complète vos ressources jusqu'au plafond garanti pour votre foyer.",
        ],
      };
    }
    return {
      status: "eligible",
      estimatedAmountLabel: `Jusqu'à ${formatEuros(plafondMensuel)} / mois selon vos ressources`,
      explanation: [
        `Vous avez ${age} ans et n'êtes pas imposable : les conditions sont a priori remplies.`,
        "Le montant exact dépend de vos ressources : l'ASPA les complète jusqu'au plafond garanti.",
      ],
      missingInfo: ["Vos revenus précis, pour estimer le montant exact."],
    };
  }

  return {
    status: "to_check",
    explanation: [
      `Vous avez ${age} ans : la condition d'âge est remplie. Reste à vérifier la condition de ressources.`,
    ],
    missingInfo: ["Êtes-vous imposable sur le revenu ?"],
  };
}

function evaluateAsi(ctx: EvalContext): AidVerdict {
  const { age, profile } = ctx;
  if (age == null) {
    return { status: "unknown", explanation: ["Indiquez votre date de naissance."] };
  }
  if (profile.disability === undefined) {
    return {
      status: "unknown",
      explanation: [
        "Indiquez si vous avez une reconnaissance de handicap ou d'invalidité pour vérifier l'ASI.",
      ],
    };
  }
  if (profile.disability === false) {
    return {
      status: "not_eligible",
      explanation: ["L'ASI s'adresse aux personnes en invalidité avant l'âge de la retraite."],
    };
  }
  if (age >= ASI.ageMax) {
    return {
      status: "not_eligible",
      explanation: ["À l'âge légal de départ à la retraite (62 à 64 ans selon votre année de naissance), c'est l'ASPA qui prend le relais de l'ASI."],
    };
  }
  if (profile.taxStatus === "imposable") {
    return {
      status: "not_eligible",
      explanation: ["L'ASI est soumise à un plafond de ressources que vos revenus dépassent a priori."],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "En situation de handicap ou d'invalidité avant l'âge de la retraite, l'ASI peut compléter vos revenus.",
    ],
    missingInfo: ["Le détail de votre pension d'invalidité et de vos ressources."],
  };
}

export const minimaDefinitions: AidDefinition[] = [
  {
    aid: {
      id: "aspa",
      name: "ASPA, le minimum vieillesse",
      shortName: "ASPA",
      category: "minima",
      scope: { level: "national" },
      authority: "Versée par votre caisse de retraite (CARSAT, MSA...)",
      impact: "eleve",
      valueStatement:
        "Complète une petite retraite chaque mois, jusqu'à un revenu minimum garanti.",
      description:
        "Un complément de revenu pour les personnes âgées aux ressources modestes : l'allocation complète vos revenus jusqu'à un montant minimum garanti.",
      whyOftenMissed:
        "Près d'une personne éligible sur deux ne la demande pas, souvent par peur de la récupération sur succession ou par méconnaissance. La demande n'est jamais automatique.",
      source: ASPA.source,
      howToApply: {
        organism:
          "Votre caisse de retraite (ou la mairie / le CCAS si vous n'avez jamais cotisé)",
        url: ASPA.source.url,
        sentenceToSay:
          "Je souhaite déposer une demande d'ASPA, l'allocation de solidarité aux personnes âgées.",
      },
      lastVerifiedAt: "2026-09-10",
    },
    evaluate: evaluateAspa,
  },
  {
    aid: {
      id: "asi",
      name: "ASI, l'allocation supplémentaire d'invalidité",
      shortName: "ASI",
      category: "minima",
      scope: { level: "national" },
      authority: "Versée par votre caisse de retraite ou d'invalidité",
      impact: "eleve",
      valueStatement: "Complète vos revenus chaque mois avant l'âge de la retraite.",
      description:
        "Un complément de revenu pour les personnes en invalidité qui n'ont pas encore l'âge de la retraite et disposent de faibles ressources.",
      whyOftenMissed:
        "Dispositif passerelle avant l'ASPA, très méconnu et souvent confondu avec l'AAH.",
      source: ASI.source,
      howToApply: {
        organism: "Votre caisse de retraite ou la caisse qui verse votre pension d'invalidité",
        url: ASI.source.url,
        sentenceToSay: "Je souhaite faire une demande d'allocation supplémentaire d'invalidité (ASI).",
      },
      lastVerifiedAt: "2026-09-10",
    },
    evaluate: evaluateAsi,
  },
];
