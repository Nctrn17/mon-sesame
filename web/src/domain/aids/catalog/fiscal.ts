import { TAXE_FONCIERE, formatEuros } from "@/domain/aids/baremes";
import type { AidDefinition } from "@/domain/aids/types";
import type { AidVerdict, EvalContext } from "@/domain/eligibility/types";

function evaluateTaxeFonciere(ctx: EvalContext): AidVerdict {
  const { age, profile } = ctx;
  if (age == null) {
    return { status: "unknown", explanation: ["Indiquez votre date de naissance."] };
  }
  if (profile.housing === undefined) {
    return {
      status: "unknown",
      explanation: ["Indiquez votre situation de logement pour vérifier cet avantage."],
    };
  }
  if (profile.housing !== "proprietaire") {
    return {
      status: "not_eligible",
      explanation: ["Cet avantage concerne les propriétaires qui occupent leur résidence principale."],
    };
  }
  if (age < TAXE_FONCIERE.ageDegrevement) {
    return {
      status: "not_eligible",
      explanation: [`Les avantages de taxe foncière liés à l'âge commencent à ${TAXE_FONCIERE.ageDegrevement} ans.`],
    };
  }

  // Aligné sur le reste du catalogue : seul "non imposable" ouvre un droit
  // chiffré ; "imposable", "inconnu" et absence de réponse passent en "à vérifier".
  const ressourcesProbables = profile.taxStatus === "non_imposable";

  if (age >= TAXE_FONCIERE.ageExonerationTotale) {
    if (ressourcesProbables) {
      return {
        status: "eligible",
        explanation: [
          `À partir de ${TAXE_FONCIERE.ageExonerationTotale} ans et sous condition de ressources, la taxe foncière de votre résidence principale peut être totalement supprimée.`,
        ],
      };
    }
    return {
      status: "to_check",
      explanation: ["Vous avez l'âge requis ; l'exonération totale dépend d'un plafond de revenu fiscal de référence."],
      missingInfo: ["Votre revenu fiscal de référence."],
    };
  }

  if (ressourcesProbables) {
    return {
      status: "eligible",
      explanation: [
        `Entre ${TAXE_FONCIERE.ageDegrevement} et ${TAXE_FONCIERE.ageExonerationTotale} ans, sous condition de ressources, vous bénéficiez d'un dégrèvement de ${formatEuros(TAXE_FONCIERE.degrevementForfaitaire)} sur la taxe foncière.`,
      ],
    };
  }
  return {
    status: "to_check",
    explanation: ["Vous avez l'âge requis ; le dégrèvement dépend d'un plafond de revenu fiscal de référence."],
    missingInfo: ["Votre revenu fiscal de référence."],
  };
}

function evaluateCreditImpotDomicile(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.usesHomeHelp === true) {
    return {
      status: "eligible",
      explanation: [
        "Vous employez une aide à domicile (ménage, aide à la personne, jardinage, téléassistance) : la moitié de la dépense vous est remboursée.",
        "C'est un crédit d'impôt : vous y avez droit même si vous ne payez pas d'impôt.",
      ],
    };
  }
  if (profile.usesHomeHelp === false) {
    return {
      status: "not_eligible",
      explanation: [
        "Dès que vous emploierez une aide à domicile, du ménage, du jardinage ou une téléassistance, la moitié de la dépense vous sera remboursée, même sans impôt à payer.",
      ],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "Si vous employez une aide à domicile, du ménage ou du jardinage, la moitié de la dépense est remboursée, même sans impôt à payer.",
    ],
    missingInfo: ["Employez-vous une aide à domicile ou une téléassistance ?"],
  };
}

function evaluateReductionEhpad(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.housing === undefined) {
    return { status: "unknown", explanation: ["Indiquez votre situation de logement."] };
  }
  if (profile.housing !== "etablissement") {
    return {
      status: "not_eligible",
      explanation: ["Cet avantage concerne les personnes hébergées en EHPAD ou en établissement."],
    };
  }
  if (profile.taxStatus === "non_imposable") {
    return {
      status: "not_eligible",
      explanation: [
        "C'est une réduction d'impôt : elle ne sert que si vous payez l'impôt sur le revenu. Voyez plutôt l'aide sociale à l'hébergement (ASH).",
      ],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "Une partie de vos frais d'EHPAD (dépendance et hébergement) ouvre droit à une réduction d'impôt de 25 %.",
    ],
    missingInfo: ["Le montant de vos frais d'hébergement et de dépendance."],
  };
}

function evaluateDemiPart(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.taxStatus === "non_imposable") {
    return {
      status: "not_eligible",
      explanation: ["La demi-part supplémentaire réduit l'impôt : sans impôt à payer, elle n'a pas d'effet."],
    };
  }
  if (profile.maritalSituation === "seul") {
    return {
      status: "to_check",
      explanation: [
        "Si vous vivez seul(e) et avez élevé un enfant, vous avez peut-être droit à une demi-part fiscale supplémentaire, très souvent oubliée.",
        "C'est aussi le cas pour les anciens combattants de 74 ans et plus, et leurs veufs ou veuves.",
      ],
      missingInfo: ["Avez-vous élevé un enfant seul(e), ou êtes-vous ancien combattant / veuf d'ancien combattant ?"],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "Les anciens combattants de 74 ans et plus, et leurs veufs ou veuves, ont droit à une demi-part fiscale supplémentaire.",
    ],
    missingInfo: ["Êtes-vous ancien combattant, ou veuf / veuve d'ancien combattant ?"],
  };
}

function evaluateExoLogementEhpad(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.housing !== "etablissement") {
    return {
      status: "not_eligible",
      explanation: ["Cet avantage concerne les personnes entrées en établissement qui conservent leur ancien logement."],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "Si vous gardez votre ancien logement (vide) après votre entrée en établissement, il garde le régime « résidence principale » : pas de surtaxe résidence secondaire, et l'exonération de taxe foncière peut continuer.",
      "Important : il faut le déclarer aux impôts (« Gérer mes biens immobiliers »), sinon le fisc taxe d'office.",
    ],
    missingInfo: ["Conservez-vous votre ancien logement, libre de toute occupation ?"],
  };
}

function evaluateVerifAvantagesFiscaux(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  const trigger =
    profile.recentlyWidowed === true ||
    profile.retirement === "bientot" ||
    profile.retirement === "actif";
  return {
    status: "to_check",
    explanation: [
      "Certains avantages s'appliquent normalement tout seuls (taux réduit de CSG, abattement sur les pensions, abattement personnes âgées).",
      trigger
        ? "Après une baisse de revenus ou un veuvage, ils ne sont pas toujours recalculés : vérifiez votre avis et réclamez un éventuel trop-prélevé aux impôts."
        : "Vérifiez de temps en temps qu'ils sont bien appliqués sur votre avis d'imposition, surtout après un changement de situation.",
    ],
    missingInfo: ["Votre situation a-t-elle changé récemment (revenus, veuvage) ?"],
  };
}

export const fiscalDefinitions: AidDefinition[] = [
  {
    aid: {
      id: "taxe-fonciere",
      name: "Exonération ou dégrèvement de taxe foncière",
      shortName: "Taxe foncière",
      category: "fiscal",
      scope: { level: "national" },
      authority: "Direction générale des finances publiques (impôts)",
      impact: "moyen",
      valueStatement: "Réduit ou supprime votre taxe foncière chaque année.",
      description:
        "Selon votre âge et vos revenus, la taxe foncière de votre résidence principale peut être réduite de 100 € ou totalement supprimée.",
      whyOftenMissed:
        "Souvent appliquée d'office, mais perdue après un changement de situation (décès du conjoint, entrée en établissement) si rien n'est signalé.",
      source: { label: "service-public.fr : exonération de taxe foncière", url: "https://www.service-public.fr/particuliers/vosdroits/F59" },
      howToApply: {
        organism: "Votre centre des impôts (espace particulier sur impots.gouv.fr)",
        url: "https://www.impots.gouv.fr/",
        sentenceToSay:
          "Je pense remplir les conditions d'exonération de taxe foncière liée à l'âge et aux ressources : pouvez-vous vérifier ?",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateTaxeFonciere,
  },
  {
    aid: {
      id: "credit-impot-domicile",
      name: "Crédit d'impôt pour une aide à domicile",
      shortName: "Crédit d'impôt aide à domicile",
      category: "fiscal",
      scope: { level: "national" },
      authority: "Direction générale des finances publiques (impôts)",
      impact: "eleve",
      valueStatement:
        "La moitié de vos dépenses d'aide à domicile remboursée, même si vous ne payez pas d'impôt.",
      description:
        "Pour le ménage, l'aide à la personne, le jardinage : 50 % de la dépense vous est rendue, sous forme de crédit d'impôt.",
      whyOftenMissed:
        "C'est un crédit (et non une réduction) : beaucoup de retraités non imposables croient à tort ne pas y avoir droit.",
      source: { label: "impots.gouv.fr : services à la personne", url: "https://www.impots.gouv.fr/" },
      howToApply: {
        organism: "Les impôts (via la déclaration de revenus ; avance immédiate possible avec le CESU+)",
        url: "https://www.impots.gouv.fr/",
        sentenceToSay: "Je voudrais bénéficier du crédit d'impôt pour l'emploi d'une aide à domicile.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateCreditImpotDomicile,
  },
  {
    aid: {
      id: "reduction-ehpad",
      name: "Réduction d'impôt pour frais d'EHPAD",
      shortName: "Réduction d'impôt EHPAD",
      category: "fiscal",
      scope: { level: "national" },
      authority: "Direction générale des finances publiques (impôts)",
      impact: "moyen",
      valueStatement: "Réduit vos impôts de 25 % des frais de dépendance et d'hébergement en EHPAD.",
      description: "Pour les personnes en EHPAD qui paient l'impôt sur le revenu.",
      whyOftenMissed: "Les familles oublient de déclarer ces frais ; la réduction peut atteindre 2 500 € par an et par personne.",
      source: { label: "impots.gouv.fr : frais de dépendance", url: "https://www.impots.gouv.fr/" },
      howToApply: {
        organism: "Les impôts, via la déclaration de revenus",
        url: "https://www.impots.gouv.fr/",
        sentenceToSay: "Je souhaite déclarer les frais d'hébergement en EHPAD pour la réduction d'impôt.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateReductionEhpad,
  },
  {
    aid: {
      id: "demi-part",
      name: "Demi-part fiscale supplémentaire",
      shortName: "Demi-part",
      category: "fiscal",
      scope: { level: "national" },
      authority: "Direction générale des finances publiques (impôts)",
      impact: "moyen",
      valueStatement: "Une demi-part fiscale en plus, qui fait baisser vos impôts.",
      description:
        "Pour les personnes seules ayant élevé un enfant, ou les anciens combattants de 74 ans et plus (et leurs veufs ou veuves).",
      whyOftenMissed:
        "La case à cocher est massivement oubliée, alors qu'elle réduit l'impôt chaque année.",
      source: { label: "impots.gouv.fr : parts et quotient familial", url: "https://www.impots.gouv.fr/" },
      howToApply: {
        organism: "Les impôts, en cochant la bonne case sur votre déclaration",
        url: "https://www.impots.gouv.fr/",
        sentenceToSay:
          "Je pense avoir droit à une demi-part supplémentaire : pouvez-vous vérifier ma déclaration ?",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateDemiPart,
  },
  {
    aid: {
      id: "exoneration-logement-ehpad",
      name: "Logement conservé après entrée en EHPAD : impôts locaux",
      shortName: "Logement conservé (EHPAD)",
      category: "fiscal",
      scope: { level: "national" },
      authority: "Direction générale des finances publiques (impôts)",
      impact: "moyen",
      valueStatement: "Votre ancien logement garde le régime « résidence principale » (pas de surtaxe, exonération possible).",
      description: "Pour les personnes en établissement qui conservent leur logement vide.",
      whyOftenMissed: "Sans déclaration d'occupation aux impôts, le logement est taxé d'office comme résidence secondaire.",
      source: { label: "service-public.fr : taxe d'habitation", url: "https://www.service-public.fr/particuliers/vosdroits/F42" },
      howToApply: {
        organism: "Les impôts, via « Gérer mes biens immobiliers » sur impots.gouv.fr",
        url: "https://www.impots.gouv.fr/",
        sentenceToSay: "Je suis en établissement et je conserve mon logement : pouvez-vous vérifier ma taxe foncière et d'habitation ?",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateExoLogementEhpad,
  },
  {
    aid: {
      id: "verif-avantages-fiscaux",
      name: "Vérifier vos avantages fiscaux",
      shortName: "Avantages fiscaux",
      category: "fiscal",
      scope: { level: "national" },
      authority: "Direction générale des finances publiques (impôts)",
      impact: "moyen",
      valueStatement: "Taux de CSG et abattements : vérifiez qu'ils sont à jour, et réclamez un trop-prélevé.",
      description: "Des avantages automatiques (CSG réduite, abattements) mal recalculés après un changement de situation.",
      whyOftenMissed: "Après une baisse de revenus ou un veuvage, on continue parfois de payer trop, sans le savoir.",
      source: { label: "service-public.fr : CSG sur les pensions", url: "https://www.service-public.fr/particuliers/vosdroits/F2971" },
      howToApply: {
        organism: "Votre centre des impôts et votre caisse de retraite",
        url: "https://www.impots.gouv.fr/",
        sentenceToSay: "Mes revenus ont baissé : mon taux de CSG et mes abattements sont-ils bien à jour ?",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateVerifAvantagesFiscaux,
  },
];
