import { CHEQUE_ENERGIE, formatEuros } from "@/domain/aids/baremes";
import type { AidDefinition } from "@/domain/aids/types";
import type { AidVerdict, EvalContext } from "@/domain/eligibility/types";

const MONTANT_ESTIME = Math.round(
  (CHEQUE_ENERGIE.montantMin + CHEQUE_ENERGIE.montantMax) / 2,
);

function evaluateChequeEnergie(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;

  if (profile.taxStatus === "non_imposable") {
    return {
      status: "eligible",
      estimatedAnnualAmount: MONTANT_ESTIME,
      estimatedAmountLabel: `entre ${formatEuros(CHEQUE_ENERGIE.montantMin)} et ${formatEuros(CHEQUE_ENERGIE.montantMax)} / an`,
      explanation: [
        "Vos revenus modestes vous placent a priori sous le plafond du chèque énergie.",
        "Il aide à payer vos factures d'électricité, de gaz, de fioul ou de bois.",
      ],
    };
  }

  if (profile.taxStatus === "imposable") {
    return {
      status: "not_eligible",
      explanation: [
        "Le chèque énergie vise les foyers modestes ; vos revenus dépassent a priori le plafond.",
      ],
    };
  }

  return {
    status: "to_check",
    explanation: ["Le chèque énergie dépend de vos revenus par rapport à la taille du foyer."],
    missingInfo: ["Êtes-vous imposable sur le revenu ?"],
  };
}

function evaluateTreveHivernale(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.taxStatus === "imposable") {
    return {
      status: "not_eligible",
      explanation: ["Cette protection vise surtout les foyers en difficulté de paiement."],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "En cas d'impayé, votre électricité et votre gaz ne peuvent pas être coupés pendant la trêve hivernale (1er novembre au 31 mars).",
      "Si vous avez le chèque énergie, vous êtes même protégé(e) contre la réduction de puissance. En difficulté, prévenez votre fournisseur et demandez un échéancier.",
    ],
    missingInfo: ["Avez-vous des difficultés à payer vos factures d'énergie ?"],
  };
}

export const energieDefinitions: AidDefinition[] = [
  {
    aid: {
      id: "cheque-energie",
      name: "Chèque énergie",
      category: "energie",
      scope: { level: "national" },
      authority: "État (Agence de services et de paiement)",
      impact: "coup_de_pouce",
      valueStatement: "Un chèque envoyé chaque année pour payer vos factures d'énergie.",
      description:
        "Une aide annuelle pour payer vos factures d'énergie ou des travaux de rénovation. Versée sous forme de chèque nominatif.",
      whyOftenMissed:
        "Depuis la fin de la taxe d'habitation, l'attribution n'est plus toujours automatique : il faut parfois le réclamer, et beaucoup d'ayants droit ne le reçoivent plus.",
      source: CHEQUE_ENERGIE.source,
      howToApply: {
        organism: "Portail chequeenergie.gouv.fr (et déclaration de revenus à jour)",
        guichet: "france_services",
        url: CHEQUE_ENERGIE.source.url,
        sentenceToSay:
          "Je vérifie mon éligibilité au chèque énergie et, si besoin, je le réclame sur le portail officiel.",
      },
      lastVerifiedAt: "2026-09-10",
    },
    evaluate: evaluateChequeEnergie,
  },
  {
    aid: {
      id: "treve-hivernale",
      name: "Protection contre les coupures d'énergie",
      shortName: "Trêve hivernale",
      category: "energie",
      scope: { level: "national" },
      authority: "Fournisseurs d'énergie (cadre légal)",
      impact: "moyen",
      valueStatement: "Pas de coupure d'électricité ni de gaz l'hiver, même en cas d'impayé.",
      description: "La trêve hivernale interdit les coupures du 1er novembre au 31 mars ; les bénéficiaires du chèque énergie sont encore plus protégés.",
      whyOftenMissed: "Par peur ou méconnaissance, on n'ose pas prévenir son fournisseur et demander un échéancier.",
      source: { label: "energie-info.fr (médiateur national de l'énergie) : difficultés de paiement", url: "https://www.energie-info.fr/fiche_pratique/jai-des-difficultes-de-paiement/" },
      howToApply: {
        organism: "Votre fournisseur d'énergie (et le FSL en cas d'impayé)",
        sentenceToSay: "J'ai du mal à payer ma facture, je voudrais un échéancier et connaître mes protections.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateTreveHivernale,
  },
];
