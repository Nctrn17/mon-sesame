import type { AidDefinition } from "@/domain/aids/types";
import type { AidVerdict, EvalContext } from "@/domain/eligibility/types";

function evaluateBilanPrevention(ctx: EvalContext): AidVerdict {
  const { age } = ctx;
  if (age == null) {
    return { status: "unknown", explanation: ["Indiquez votre date de naissance."] };
  }
  const inWindow = (age >= 60 && age <= 65) || (age >= 70 && age <= 75);
  if (!inWindow) {
    return {
      status: "to_check",
      explanation: ["Le rendez-vous Mon Bilan Prévention est proposé aux âges clés (60-65 ans, puis 70-75 ans)."],
    };
  }
  return {
    status: "eligible",
    explanation: [
      "Vous êtes dans une tranche d'âge clé : un rendez-vous de prévention gratuit (30 à 45 min) avec un professionnel de santé, sans avance de frais.",
      "On y fait le point sur votre santé, votre autonomie et votre isolement.",
    ],
  };
}

function evaluateMonSoutienPsy(): AidVerdict {
  return {
    status: "eligible",
    explanation: [
      "Si vous vous sentez seul(e), anxieux(se) ou déprimé(e), vous avez droit à des séances de psychologue remboursées (12 par an).",
      "Accès direct, sans ordonnance, avec un psychologue partenaire.",
    ],
  };
}

function evaluateVaccinations(ctx: EvalContext): AidVerdict {
  const { age } = ctx;
  if (age == null) {
    return { status: "unknown", explanation: ["Indiquez votre date de naissance."] };
  }
  if (age < 65) {
    return {
      status: "to_check",
      explanation: ["Certaines vaccinations deviennent gratuites ou recommandées à partir de 65 ans (grippe, zona)."],
    };
  }
  return {
    status: "eligible",
    explanation: [
      "À partir de 65 ans, la vaccination contre la grippe est gratuite (bon envoyé par l'Assurance Maladie) et le vaccin contre le zona est recommandé et remboursé.",
      "Pour le zona, pensez à en parler à votre médecin ou pharmacien : il n'y a pas de bon automatique.",
    ],
  };
}

function evaluateSportSante(): AidVerdict {
  return {
    status: "to_check",
    explanation: [
      "En cas de maladie chronique, d'ALD ou de perte d'autonomie, votre médecin peut prescrire une activité physique adaptée (Maisons Sport-Santé).",
      "Attention : ce n'est en général pas remboursé par la Sécurité sociale, mais souvent par les mutuelles ou les collectivités. Vérifiez votre contrat.",
    ],
    missingInfo: ["Avez-vous une maladie chronique ou un besoin d'activité adaptée ?"],
  };
}

export const preventionDefinitions: AidDefinition[] = [
  {
    aid: {
      id: "bilan-prevention",
      name: "Mon Bilan Prévention",
      shortName: "Bilan prévention",
      category: "sante",
      scope: { level: "national" },
      authority: "Assurance Maladie",
      impact: "coup_de_pouce",
      valueStatement: "Un rendez-vous de prévention gratuit aux âges clés, pour faire le point sur votre santé.",
      description: "Un temps d'échange (30 à 45 min) avec un professionnel de santé, pris en charge à 100%.",
      whyOftenMissed: "Dispositif récent (2024), encore très peu connu, alors qu'il repère tôt la fragilité et l'isolement.",
      source: { label: "ameli.fr : Mon Bilan Prévention", url: "https://www.ameli.fr/assure/sante/mon-bilan-prevention" },
      howToApply: {
        organism: "Médecin, infirmier, pharmacien ou sage-femme (prise de rendez-vous directe)",
        url: "https://www.ameli.fr/assure/sante/mon-bilan-prevention",
        sentenceToSay: "Je voudrais faire mon rendez-vous Mon Bilan Prévention.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateBilanPrevention,
  },
  {
    aid: {
      id: "mon-soutien-psy",
      name: "Séances de psychologue remboursées (Mon soutien psy)",
      shortName: "Mon soutien psy",
      category: "sante",
      scope: { level: "national" },
      authority: "Assurance Maladie",
      impact: "coup_de_pouce",
      valueStatement: "Jusqu'à 12 séances de psychologue par an, remboursées.",
      description: "Un accompagnement en cas de mal-être, d'anxiété ou de dépression, fréquents avec l'isolement.",
      whyOftenMissed: "Communiqué surtout vers les jeunes, alors que la dépression et la solitude du grand âge sont massives.",
      source: { label: "ameli.fr : Mon soutien psy", url: "https://www.ameli.fr/assure/remboursements/rembourse/remboursement-seance-psychologue-mon-soutien-psy" },
      howToApply: {
        organism: "Un psychologue partenaire Mon soutien psy (accès direct)",
        url: "https://www.ameli.fr/assure/remboursements/rembourse/remboursement-seance-psychologue-mon-soutien-psy",
        sentenceToSay: "Je souhaite bénéficier des séances Mon soutien psy.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateMonSoutienPsy,
  },
  {
    aid: {
      id: "vaccinations-seniors",
      name: "Vaccinations prises en charge (grippe, zona)",
      shortName: "Vaccinations",
      category: "sante",
      scope: { level: "national" },
      authority: "Assurance Maladie",
      impact: "coup_de_pouce",
      valueStatement: "La grippe gratuite dès 65 ans, et le zona recommandé et remboursé.",
      description: "Des vaccinations qui évitent des maladies graves et des hospitalisations.",
      whyOftenMissed: "Le vaccin contre le zona, récent, est très peu demandé faute d'information.",
      source: { label: "ameli.fr : vaccination", url: "https://www.ameli.fr/assure/sante/assurance-maladie/campagnes-vaccination/vaccination-grippe-saisonniere" },
      howToApply: {
        organism: "Votre médecin, pharmacien ou infirmier",
        sentenceToSay: "Suis-je à jour pour les vaccins grippe et zona ?",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateVaccinations,
  },
  {
    aid: {
      id: "sport-sante",
      name: "Activité physique adaptée (sport sur ordonnance)",
      shortName: "Sport-santé",
      category: "sante",
      scope: { level: "national" },
      authority: "Médecin + Maisons Sport-Santé",
      impact: "coup_de_pouce",
      valueStatement: "Une activité physique encadrée et adaptée, utile contre la perte d'autonomie.",
      description: "Sur prescription, un programme adapté à votre santé, souvent financé par la mutuelle ou la collectivité.",
      whyOftenMissed: "On la croit remboursée par la Sécu (ce n'est pas le cas en général) et on ne pense pas à la mutuelle.",
      source: { label: "ameli.fr : activité physique adaptée", url: "https://www.ameli.fr/assure/sante/themes/activite-physique-sante/prescription-d-activite-physique-adaptee" },
      howToApply: {
        organism: "Votre médecin (prescription) puis une Maison Sport-Santé",
        sentenceToSay: "Pourriez-vous me prescrire une activité physique adaptée ?",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateSportSante,
  },
];
