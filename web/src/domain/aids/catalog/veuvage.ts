import { REVERSION } from "@/domain/aids/baremes";
import type { AidDefinition } from "@/domain/aids/types";
import type { AidVerdict, EvalContext } from "@/domain/eligibility/types";

function evaluateReversion(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;

  if (profile.recentlyWidowed) {
    return {
      status: "to_check",
      explanation: [
        "À la suite d'un veuvage, vous avez probablement droit à une part de la retraite de votre conjoint.",
        "Deux réversions à demander séparément : celle du régime de base (sous condition de ressources, dès 55 ans) et celle des régimes complémentaires (Agirc-Arrco : 60%, SANS condition de ressources).",
        "Rien ne se déclenche automatiquement, et le remariage fait perdre certains droits.",
      ],
      missingInfo: ["Le ou les régimes de retraite de votre conjoint, et vos ressources (pour le régime de base)."],
    };
  }

  if (profile.maritalSituation === "couple") {
    return {
      status: "not_eligible",
      explanation: ["La pension de réversion concerne le conjoint survivant après un décès."],
    };
  }

  return {
    status: "to_check",
    explanation: [
      "Si vous êtes veuf ou veuve, vérifiez votre droit à la pension de réversion (base ET complémentaire) de votre ancien conjoint.",
    ],
    missingInfo: ["Êtes-vous veuf ou veuve d'une personne ayant cotisé pour la retraite ?"],
  };
}

function evaluateFraisObseques(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.recentlyWidowed) {
    return {
      status: "eligible",
      explanation: [
        "Pour régler des obsèques, la banque du défunt peut payer la facture directement depuis son compte, jusqu'à environ 6 000 €, même si le compte est bloqué.",
        "Beaucoup avancent les frais de leur poche en croyant le compte inaccessible.",
      ],
    };
  }
  return {
    status: "not_eligible",
    explanation: ["Cette possibilité concerne le règlement des obsèques d'un proche récemment décédé."],
  };
}

export const veuvageDefinitions: AidDefinition[] = [
  {
    aid: {
      id: "reversion",
      name: "Pension de réversion (base et complémentaire)",
      shortName: "Réversion",
      category: "veuvage",
      scope: { level: "national" },
      authority: "Les caisses de retraite de votre conjoint décédé",
      impact: "eleve",
      valueStatement: "Une partie de la retraite de votre conjoint décédé vous est reversée chaque mois.",
      description:
        "La réversion existe au régime de base (sous conditions) et aux régimes complémentaires (60%, sans condition de ressources).",
      whyOftenMissed:
        "Le veuvage est un moment où l'on oublie ses droits ; la demande doit être déposée auprès de chaque régime.",
      source: { label: "info-retraite.fr : réversion", url: REVERSION.source.url },
      howToApply: {
        organism: "Une demande unique possible sur info-retraite.fr (tous régimes)",
        url: REVERSION.source.url,
        sentenceToSay: "Je souhaite demander la pension de réversion de mon conjoint décédé.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateReversion,
  },
  {
    aid: {
      id: "frais-obseques",
      name: "Paiement des obsèques sur le compte du défunt",
      shortName: "Frais d'obsèques",
      category: "veuvage",
      scope: { level: "national" },
      authority: "La banque du défunt",
      impact: "moyen",
      valueStatement: "Régler les obsèques directement depuis le compte du défunt, sans avancer l'argent.",
      description: "La banque débite le compte du défunt pour payer les funérailles, jusqu'à environ 6 000 €.",
      whyOftenMissed: "Méconnu : les proches avancent souvent les frais en croyant le compte bloqué.",
      source: { label: "service-public.fr : frais d'obsèques", url: "https://www.service-public.fr/particuliers/vosdroits/F1922" },
      howToApply: {
        organism: "La banque du défunt, sur présentation de la facture des pompes funèbres",
        sentenceToSay: "Je voudrais régler les obsèques depuis le compte du défunt.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateFraisObseques,
  },
];
