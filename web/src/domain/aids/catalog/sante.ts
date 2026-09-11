import { CSS } from "@/domain/aids/baremes";
import type { AidDefinition } from "@/domain/aids/types";
import type { AidVerdict, EvalContext } from "@/domain/eligibility/types";

function evaluateCss(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.taxStatus === "non_imposable") {
    return {
      status: "eligible",
      explanation: [
        "Comme vous n'êtes pas imposable, vos ressources sont a priori sous le plafond.",
        "La Complémentaire santé solidaire prend en charge la part non remboursée de vos soins (médecin, dentaire, optique, audioprothèses).",
      ],
    };
  }
  if (profile.taxStatus === "imposable") {
    return {
      status: "to_check",
      explanation: [
        "Même imposable, si vos revenus sont juste au-dessus du seuil, vous pouvez accéder à la CSS moyennant une petite participation mensuelle (moins d'un euro par jour).",
      ],
      missingInfo: ["Le montant de vos ressources annuelles."],
    };
  }
  return {
    status: "to_check",
    explanation: ["La Complémentaire santé solidaire réduit fortement vos frais de santé, selon vos ressources."],
    missingInfo: ["Êtes-vous imposable sur le revenu ?"],
  };
}

function evaluateAld(): AidVerdict {
  return {
    status: "to_check",
    explanation: [
      "Si vous avez une maladie de longue durée (diabète, cancer, Alzheimer, Parkinson, insuffisance cardiaque...), demandez à votre médecin de vous mettre en ALD.",
      "Vos soins liés à cette maladie sont alors pris en charge à 100% (base Sécurité sociale).",
    ],
    missingInfo: ["Avez-vous une affection de longue durée reconnue par votre médecin ?"],
  };
}

function evaluateSante100(): AidVerdict {
  return {
    status: "eligible",
    explanation: [
      "Pour vos lunettes, prothèses dentaires et appareils auditifs, demandez un devis « 100% Santé » : reste à charge zéro.",
      "Le professionnel doit vous proposer cette offre. Pensez à la réclamer avant tout achat.",
    ],
  };
}

function evaluateTransportSanitaire(): AidVerdict {
  return {
    status: "to_check",
    explanation: [
      "Pour vos trajets vers l'hôpital ou des soins (ambulance, taxi conventionné, VSL), demandez une prescription de transport à votre médecin : c'est remboursé.",
      "Souvent payé de sa poche faute de savoir qu'une prescription suffit.",
    ],
    missingInfo: ["Avez-vous des trajets médicaux réguliers ou prescrits ?"],
  };
}

function evaluateCureThermale(): AidVerdict {
  return {
    status: "to_check",
    explanation: [
      "Sur prescription de votre médecin, une cure thermale (18 jours) est remboursée par l'Assurance Maladie.",
      "Pour les revenus modestes, l'hébergement et le transport peuvent aussi être pris en charge.",
    ],
    missingInfo: ["Une cure est-elle utile pour votre santé (rhumatismes, respiration...) ?"],
  };
}

export const santeDefinitions: AidDefinition[] = [
  {
    aid: {
      id: "css",
      name: "Complémentaire santé solidaire",
      shortName: "CSS",
      category: "sante",
      scope: { level: "national" },
      authority: "Assurance Maladie (CPAM) ou MSA",
      impact: "eleve",
      valueStatement:
        "Vos soins remboursés sans rien avancer ni payer en plus : médecin, dentaire, lunettes, audition.",
      description:
        "Une complémentaire santé gratuite ou à très faible coût (selon vos revenus) qui supprime ou réduit fortement ce qui reste à votre charge.",
      whyOftenMissed: "Le non-recours est très élevé chez les seniors modestes ; beaucoup de bénéficiaires de l'ASPA y ont droit sans le demander.",
      source: { label: "service-public.gouv.fr : CSS", url: CSS.source.url },
      howToApply: {
        organism: "Votre caisse d'Assurance Maladie (compte ameli) ou la MSA",
        guichet: "cpam",
        url: CSS.source.url,
        sentenceToSay: "Je voudrais faire une demande de Complémentaire santé solidaire.",
      },
      lastVerifiedAt: "2026-09-10",
    },
    evaluate: evaluateCss,
  },
  {
    aid: {
      id: "ald",
      name: "Prise en charge à 100% (ALD)",
      shortName: "ALD",
      category: "sante",
      scope: { level: "national" },
      authority: "Assurance Maladie, via votre médecin traitant",
      impact: "eleve",
      valueStatement: "Vos soins liés à une maladie de longue durée pris en charge à 100%.",
      description: "L'affection de longue durée (ALD) supprime le ticket modérateur sur les soins liés à votre maladie.",
      whyOftenMissed: "Perçue comme automatique, alors que c'est le médecin qui doit en faire la demande à la CPAM.",
      source: { label: "ameli.fr : ALD", url: "https://www.ameli.fr/assure/droits-demarches/maladie-accident-hospitalisation/affection-longue-duree-ald" },
      howToApply: {
        organism: "Votre médecin traitant (qui établit le protocole de soins)",
        guichet: "cpam",
        url: "https://www.ameli.fr/assure/droits-demarches/maladie-accident-hospitalisation/affection-longue-duree-ald",
        sentenceToSay: "Pensez-vous que je relève d'une ALD ? Pouvez-vous faire la demande ?",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateAld,
  },
  {
    aid: {
      id: "sante-100",
      name: "100% Santé (lunettes, dentaire, audition)",
      shortName: "100% Santé",
      category: "sante",
      scope: { level: "national" },
      authority: "Assurance Maladie + complémentaire",
      impact: "moyen",
      valueStatement: "Des lunettes, prothèses dentaires et appareils auditifs sans reste à charge.",
      description: "Un panier d'équipements de qualité intégralement remboursé, à demander à votre professionnel de santé.",
      whyOftenMissed: "Les professionnels proposent souvent d'abord des équipements plus chers, hors panier 100% Santé.",
      source: { label: "securite-sociale.fr : 100% Santé", url: "https://www.securite-sociale.fr/home/dossiers/galerie-dossiers/tous-les-dossiers/100-sante--des-soins-pour-tous-1.html" },
      howToApply: {
        organism: "Votre opticien, dentiste ou audioprothésiste",
        sentenceToSay: "Pouvez-vous me faire un devis avec l'offre 100% Santé ?",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateSante100,
  },
  {
    aid: {
      id: "transport-sanitaire",
      name: "Transport médical remboursé",
      shortName: "Transport médical",
      category: "sante",
      scope: { level: "national" },
      authority: "Assurance Maladie, sur prescription",
      impact: "coup_de_pouce",
      valueStatement: "Vos trajets vers les soins remboursés (ambulance, taxi conventionné, VSL).",
      description: "Sur prescription médicale, le transport vers l'hôpital ou des soins est pris en charge.",
      whyOftenMissed: "On paie souvent un taxi de sa poche sans savoir qu'une prescription le rend remboursable.",
      source: { label: "ameli.fr : frais de transport", url: "https://www.ameli.fr/assure/remboursements/rembourse/frais-transport" },
      howToApply: {
        organism: "Votre médecin (prescription de transport) puis l'Assurance Maladie",
        guichet: "cpam",
        sentenceToSay: "Pouvez-vous me prescrire un transport pour mes soins ?",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateTransportSanitaire,
  },
  {
    aid: {
      id: "cure-thermale",
      name: "Cure thermale remboursée",
      shortName: "Cure thermale",
      category: "sante",
      scope: { level: "national" },
      authority: "Assurance Maladie, sur prescription",
      impact: "coup_de_pouce",
      valueStatement: "Une cure thermale prise en charge, et l'hébergement aidé si revenus modestes.",
      description: "18 jours de soins en établissement conventionné, sur prescription médicale.",
      whyOftenMissed: "Perçue comme du tourisme non remboursé ; l'aide à l'hébergement pour revenus modestes est ignorée.",
      source: { label: "ameli.fr : cure thermale", url: "https://www.ameli.fr/assure/remboursements/rembourse/cure-thermale" },
      howToApply: {
        organism: "Votre médecin (prescription) puis l'Assurance Maladie",
        guichet: "cpam",
        sentenceToSay: "Une cure thermale serait-elle indiquée pour moi ?",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateCureThermale,
  },
];
