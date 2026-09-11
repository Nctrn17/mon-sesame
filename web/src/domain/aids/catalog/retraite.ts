import type { AidDefinition } from "@/domain/aids/types";
import type { AidVerdict, EvalContext } from "@/domain/eligibility/types";

function evaluateRetraiteProgressive(ctx: EvalContext): AidVerdict {
  const { age, profile } = ctx;
  if (profile.retirement === "retraite") {
    return { status: "not_eligible", explanation: ["Vous êtes déjà à la retraite : la retraite progressive se prépare avant le départ."] };
  }
  if (age != null && age < 60) {
    return { status: "not_eligible", explanation: ["La retraite progressive est accessible à partir de 60 ans."] };
  }
  return {
    status: "to_check",
    explanation: [
      "Si vous travaillez encore, vous pouvez passer à temps partiel (40 à 80%) et toucher déjà une partie de votre retraite, dès 60 ans (avec 150 trimestres).",
      "Cela adoucit la transition et continue à améliorer votre future pension.",
    ],
    missingInfo: ["Souhaitez-vous réduire votre activité avant la retraite complète ?"],
  };
}

function evaluateCumulEmploiRetraite(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.retirement === "retraite") {
    return {
      status: "to_check",
      explanation: [
        "Vous pouvez reprendre une activité tout en gardant votre retraite. Depuis 2023, cela peut même créer une seconde pension.",
      ],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "Une fois à la retraite, vous pourrez travailler et cumuler les revenus avec votre pension (intégralement si vous avez le taux plein).",
      "Cela peut générer une seconde pension à demander.",
    ],
  };
}

function evaluateRachatTrimestres(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.retirement === "retraite") {
    return { status: "not_eligible", explanation: ["Le rachat de trimestres se fait avant la liquidation de la retraite."] };
  }
  return {
    status: "to_check",
    explanation: [
      "Avant de partir, vous pouvez racheter des trimestres (années d'études, années incomplètes) pour améliorer votre pension.",
      "Le coût est déductible de vos impôts et peut être étalé sans intérêts.",
    ],
    missingInfo: ["Avez-vous des trimestres manquants (études, périodes incomplètes) ?"],
  };
}

function evaluatePolypensionne(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.scheme === "mixte") {
    return {
      status: "to_check",
      explanation: [
        "Avec une carrière mixte, pensez à liquider TOUS vos régimes (privé, public...).",
        "Un régime oublié peut bloquer votre taux plein et le minimum de pension. Reconstituez votre carrière sur info-retraite.fr.",
      ],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "Si vous avez cotisé à plusieurs régimes au cours de votre carrière, vérifiez que vous les avez tous demandés.",
      "Un seul relevé oublié peut faire baisser votre pension. Tout se vérifie sur info-retraite.fr.",
    ],
  };
}

export const retraiteDefinitions: AidDefinition[] = [
  {
    aid: {
      id: "retraite-progressive",
      name: "Retraite progressive",
      category: "retraite",
      scope: { level: "national" },
      authority: "Votre caisse de retraite",
      impact: "moyen",
      valueStatement: "Travailler à temps partiel tout en touchant déjà une partie de votre retraite.",
      description: "Dès 60 ans, une transition en douceur vers la retraite, qui continue d'améliorer vos droits.",
      whyOftenMissed: "Crue réservée à certains métiers ; l'abaissement à 60 ans est récent et mal connu.",
      source: { label: "lassuranceretraite.fr : retraite progressive", url: "https://www.lassuranceretraite.fr/portail-info/home/actif/je-souhaite-partir-plus-tot/retraite-progressive.html" },
      howToApply: {
        organism: "Votre caisse de retraite (et accord de l'employeur sur le temps partiel)",
        sentenceToSay: "Je souhaite préparer une retraite progressive.",
      },
      lastVerifiedAt: "2026-09-10",
    },
    evaluate: evaluateRetraiteProgressive,
  },
  {
    aid: {
      id: "cumul-emploi-retraite",
      name: "Cumul emploi-retraite",
      category: "retraite",
      scope: { level: "national" },
      authority: "Votre caisse de retraite",
      impact: "moyen",
      valueStatement: "Travailler en gardant votre retraite, et parfois acquérir une seconde pension.",
      description: "Reprendre une activité après la retraite, sans perdre sa pension (cumul intégral si taux plein).",
      whyOftenMissed: "Peu savent que, depuis 2023, l'activité après la retraite peut créer une nouvelle pension.",
      source: { label: "service-public.gouv.fr : cumul emploi-retraite", url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F13243" },
      howToApply: {
        organism: "Votre caisse de retraite",
        sentenceToSay: "Je voudrais reprendre une activité en cumul emploi-retraite.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateCumulEmploiRetraite,
  },
  {
    aid: {
      id: "rachat-trimestres",
      name: "Rachat de trimestres",
      category: "retraite",
      scope: { level: "national" },
      authority: "Votre caisse de retraite",
      impact: "moyen",
      valueStatement: "Améliorer votre future pension en rachetant des trimestres manquants.",
      description: "Racheter jusqu'à 12 trimestres (études, années incomplètes) avant le départ, avec un avantage fiscal.",
      whyOftenMissed: "Levier d'optimisation à activer avant la liquidation, dont l'intérêt fiscal est méconnu.",
      source: { label: "lassuranceretraite.fr : racheter des trimestres", url: "https://www.lassuranceretraite.fr/portail-info/home/actif/ma-carriere/rachat-trimestres-retraite.html" },
      howToApply: {
        organism: "Votre caisse de retraite",
        sentenceToSay: "Je voudrais étudier un rachat de trimestres.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateRachatTrimestres,
  },
  {
    aid: {
      id: "polypensionne",
      name: "Vérifier tous vos régimes de retraite",
      shortName: "Tous vos régimes",
      category: "retraite",
      scope: { level: "national" },
      authority: "Info-retraite (tous régimes)",
      impact: "moyen",
      valueStatement: "Ne perdez pas de pension : faites valoir chaque régime où vous avez cotisé.",
      description: "Un régime oublié peut réduire votre pension et bloquer le taux plein. Tout se vérifie en un seul endroit.",
      whyOftenMissed: "Les carrières mixtes (privé, public, indépendant) sont fréquentes et un relevé passe vite à la trappe.",
      source: { label: "info-retraite.fr", url: "https://www.info-retraite.fr/" },
      howToApply: {
        organism: "info-retraite.fr (compte unique tous régimes)",
        guichet: "france_services",
        url: "https://www.info-retraite.fr/",
        sentenceToSay: "Je veux vérifier que tous mes régimes de retraite sont bien pris en compte.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluatePolypensionne,
  },
];
