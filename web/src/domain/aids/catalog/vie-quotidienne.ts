import type { AidDefinition } from "@/domain/aids/types";
import type { AidVerdict, EvalContext } from "@/domain/eligibility/types";

const AGE_REDUC = 60;

function evaluateReductionsSeniors(ctx: EvalContext): AidVerdict {
  const { age } = ctx;
  if (age == null) {
    return { status: "unknown", explanation: ["Indiquez votre date de naissance."] };
  }
  if (age < AGE_REDUC) {
    return {
      status: "not_eligible",
      explanation: [`Les tarifs seniors commencent généralement vers ${AGE_REDUC}-65 ans.`],
    };
  }
  return {
    status: "eligible",
    explanation: [
      "Pensez à demander le tarif senior : il existe dans beaucoup de musées, cinémas, piscines, théâtres et transports. Souvent, il suffit de présenter une pièce d'identité.",
      "Avec une carte mobilité inclusion (invalidité), l'entrée des musées et monuments est souvent gratuite, parfois aussi pour la personne qui vous accompagne.",
    ],
  };
}

function evaluateFranceServices(): AidVerdict {
  return {
    status: "eligible",
    explanation: [
      "Un accompagnement gratuit pour toutes vos démarches (retraite, impôts, CAF, santé, papiers) dans un espace France Services près de chez vous.",
      "Idéal si vous n'êtes pas à l'aise avec Internet : un conseiller fait avec vous.",
    ],
  };
}

function evaluateFraisBancaires(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.taxStatus === "imposable") {
    return {
      status: "not_eligible",
      explanation: ["Ce dispositif vise les personnes en difficulté financière."],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "Si votre budget est serré, votre banque doit plafonner les frais en cas d'incident et vous proposer une offre spécifique à petit prix (clientèle fragile).",
      "Elle ne le propose presque jamais d'elle-même : il faut la demander.",
    ],
    missingInfo: ["Votre situation financière (incidents, ressources)."],
  };
}

function evaluateAideJuridictionnelle(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.taxStatus === "imposable") {
    return {
      status: "not_eligible",
      explanation: ["L'aide juridictionnelle est soumise à un plafond de ressources que vos revenus dépassent a priori."],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "Si vous avez un litige (succession, conflit, surendettement...), l'État peut payer tout ou partie de vos frais d'avocat et de justice.",
    ],
    missingInfo: ["Vos ressources et la nature de la démarche juridique."],
  };
}

function evaluateTarifSocialTelecom(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.taxStatus === "imposable") {
    return {
      status: "not_eligible",
      explanation: ["Le tarif social internet et téléphone vise les foyers à faibles ressources."],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "Si vous percevez l'ASPA, le RSA ou l'ASS, ou si votre quotient familial est faible, vous pouvez avoir une offre internet (environ 16 € / mois) et une ligne fixe (environ 6,50 € / mois) à tarif social.",
      "L'organisme qui verse votre prestation (caisse de retraite, CAF) vous remet une attestation à donner à l'opérateur.",
    ],
    missingInfo: ["Percevez-vous l'ASPA, le RSA, ou avez-vous un quotient familial faible ?"],
  };
}

function evaluateSortirPlus(ctx: EvalContext): AidVerdict {
  const { age, profile } = ctx;
  if (age == null) {
    return { status: "unknown", explanation: ["Indiquez votre date de naissance."] };
  }
  if (age < 75) {
    return {
      status: "not_eligible",
      explanation: ["Le dispositif Sortir Plus est accessible à partir de 75 ans."],
    };
  }
  if (profile.scheme === "fonction_publique" || profile.scheme === "agricole") {
    return {
      status: "to_check",
      explanation: [
        "Sortir Plus est réservé aux retraités du privé (Agirc-Arrco). Votre régime propose souvent une aide équivalente : renseignez-vous auprès de votre caisse.",
      ],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "Dès 75 ans, si vous avez travaillé dans le privé (retraite complémentaire Agirc-Arrco), vous pouvez être accompagné(e) pour vos sorties : courses, rendez-vous médicaux, promenades.",
      "Sans condition de revenus. Cela finance plusieurs sorties accompagnées par an, pour ne pas rester isolé(e).",
    ],
    missingInfo: ["Avez-vous une retraite complémentaire Agirc-Arrco (carrière dans le privé) ?"],
  };
}

function evaluatePointConseilBudget(): AidVerdict {
  return {
    status: "eligible",
    explanation: [
      "Un conseiller peut vous aider gratuitement à gérer votre budget, repérer des droits non réclamés et faire face à une difficulté.",
      "Gratuit, confidentiel, ouvert à tous, utile aussi pour anticiper un veuvage ou une baisse de pension.",
    ],
  };
}

function evaluateSurendettement(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  if (profile.taxStatus === "imposable") {
    return {
      status: "not_eligible",
      explanation: ["La procédure de surendettement s'adresse aux personnes qui ne peuvent plus faire face à leurs dettes."],
    };
  }
  return {
    status: "to_check",
    explanation: [
      "Si vous ne pouvez plus payer vos dettes, la commission de surendettement de la Banque de France peut suspendre les poursuites, rééchelonner, voire effacer des dettes.",
      "Le dépôt est gratuit, et avoir une retraite n'empêche pas d'y recourir.",
    ],
    missingInfo: ["Avez-vous des dettes que vous n'arrivez plus à rembourser ?"],
  };
}

function evaluateDroitAuCompte(): AidVerdict {
  return {
    status: "to_check",
    explanation: [
      "Si une banque refuse de vous ouvrir un compte, la Banque de France peut en désigner une qui devra le faire, avec des services bancaires de base gratuits.",
      "Utile après un veuvage, un déménagement ou un refus.",
    ],
    missingInfo: ["Une banque vous a-t-elle refusé l'ouverture d'un compte ?"],
  };
}

function evaluateMicrocredit(): AidVerdict {
  return {
    status: "to_check",
    explanation: [
      "Pour un besoin que les banques refusent de financer (mobilité, équipement, adaptation, santé), le microcrédit personnel accompagné prête jusqu'à 8 000 € à taux modéré.",
      "Il s'accompagne d'un suivi gratuit ; on y accède via le CCAS, une association ou un Point Conseil Budget.",
    ],
    missingInfo: ["Avez-vous un besoin de financement non couvert par votre banque ?"],
  };
}

function evaluateConciliateur(): AidVerdict {
  return {
    status: "eligible",
    explanation: [
      "En cas de litige (voisinage, charges, bail, consommation, impayés), un conciliateur de justice vous aide à trouver un accord, gratuitement et sans avocat.",
      "L'accord trouvé peut avoir la même valeur qu'un jugement.",
    ],
  };
}

function evaluateAideVictimes(): AidVerdict {
  return {
    status: "eligible",
    explanation: [
      "Victime d'une escroquerie, d'un abus de faiblesse, d'un vol ou de maltraitance ? Le 116 006 (gratuit, 7j/7) vous écoute et vous accompagne (juridique, psychologique, social).",
      "Les seniors sont souvent ciblés par les arnaques : ce soutien existe pour vous.",
    ],
  };
}

function evaluateSeniorsVacances(ctx: EvalContext): AidVerdict {
  const { age, profile } = ctx;
  if (age == null) {
    return { status: "unknown", explanation: ["Indiquez votre date de naissance."] };
  }
  if (age < 60) {
    return { status: "not_eligible", explanation: ["Le programme Seniors en Vacances est ouvert à partir de 60 ans (55 ans en cas de handicap)."] };
  }
  return {
    status: "eligible",
    explanation: [
      "Dès 60 ans, l'ANCV propose des séjours à tarif réduit, pour rompre l'isolement et changer d'air.",
      profile.taxStatus === "non_imposable"
        ? "Vos revenus modestes peuvent ouvrir une prise en charge jusqu'à la moitié du séjour."
        : "Une aide existe, plus importante si vos revenus sont modestes.",
    ],
  };
}

function evaluateIsolement(ctx: EvalContext): AidVerdict {
  const { profile } = ctx;
  const seul = profile.maritalSituation === "seul";
  return {
    status: "eligible",
    explanation: [
      seul
        ? "Si la solitude vous pèse, des bénévoles peuvent vous rendre visite ou vous appeler régulièrement, gratuitement."
        : "Des associations proposent visites, appels et sorties pour rompre l'isolement, pour vous ou un proche.",
      "Contactez MONALISA, les Petits Frères des Pauvres, ou la ligne Solitud'écoute. C'est gratuit.",
    ],
  };
}

function evaluateMandatProtection(): AidVerdict {
  return {
    status: "eligible",
    explanation: [
      "Tant que vous allez bien, vous pouvez désigner à l'avance une personne de confiance pour gérer vos affaires si un jour vous ne le pouvez plus (mandat de protection future).",
      "Simple, cela évite une tutelle subie plus tard et protège aussi votre conjoint.",
    ],
  };
}

export const vieQuotidienneDefinitions: AidDefinition[] = [
  {
    aid: {
      id: "reductions-seniors",
      name: "Réductions seniors (culture, loisirs, sport)",
      shortName: "Tarifs seniors",
      category: "vie_quotidienne",
      scope: { level: "national" },
      authority: "Musées, cinémas, équipements sportifs et culturels",
      impact: "coup_de_pouce",
      valueStatement: "Des tarifs réduits dès 60-65 ans dans beaucoup de lieux culturels et de loisirs.",
      description: "Musées, cinémas, piscines, théâtres, transports : le tarif senior existe presque partout.",
      whyOftenMissed: "On n'ose pas toujours demander, alors que la réduction est quasi systématique.",
      source: {
        label: "pour-les-personnes-agees.gouv.fr",
        url: "https://www.pour-les-personnes-agees.gouv.fr/",
      },
      howToApply: {
        organism: "À la billetterie ou au guichet (musée, cinéma, piscine...)",
        sentenceToSay: "Avez-vous un tarif senior ? Voici ma pièce d'identité.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateReductionsSeniors,
  },
  {
    aid: {
      id: "france-services",
      name: "Aide gratuite à vos démarches (France Services)",
      shortName: "France Services",
      category: "vie_quotidienne",
      scope: { level: "national" },
      authority: "État (réseau France Services)",
      impact: "coup_de_pouce",
      valueStatement: "Un conseiller qui fait vos démarches avec vous, gratuitement, près de chez vous.",
      description: "Un guichet unique pour la retraite, les impôts, la CAF, la santé, les papiers.",
      whyOftenMissed: "Beaucoup de personnes peu à l'aise avec Internet ignorent que cette aide existe et qu'elle est gratuite.",
      source: { label: "france-services.gouv.fr", url: "https://www.france-services.gouv.fr/" },
      howToApply: {
        organism: "Un espace France Services près de chez vous (souvent en mairie)",
        url: "https://www.france-services.gouv.fr/",
        sentenceToSay: "J'aimerais de l'aide pour faire mes démarches.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateFranceServices,
  },
  {
    aid: {
      id: "frais-bancaires",
      name: "Frais bancaires plafonnés (clientèle fragile)",
      shortName: "Frais bancaires",
      category: "vie_quotidienne",
      scope: { level: "national" },
      authority: "Votre banque (cadre légal)",
      impact: "coup_de_pouce",
      valueStatement: "Si votre budget est serré, vos frais bancaires en cas d'incident peuvent être plafonnés.",
      description: "Une offre bancaire à petit prix et un plafonnement des frais pour les personnes en difficulté financière.",
      whyOftenMissed: "Les banques ne la proposent presque jamais spontanément.",
      source: { label: "banque-france.fr : plafonnement des frais bancaires et offre clientèle fragile", url: "https://www.banque-france.fr/fr/a-votre-service/particuliers/connaitre-pratiques-bancaires-assurance/compte-frais/le-plafonnement-des-frais-bancaires-et-loffre-clientele-fragile" },
      howToApply: {
        organism: "Votre banque",
        sentenceToSay:
          "Je voudrais l'offre spécifique clientèle fragile et le plafonnement de mes frais bancaires.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateFraisBancaires,
  },
  {
    aid: {
      id: "aide-juridictionnelle",
      name: "Aide juridictionnelle",
      shortName: "Aide juridictionnelle",
      category: "vie_quotidienne",
      scope: { level: "national" },
      authority: "Ministère de la Justice",
      impact: "coup_de_pouce",
      valueStatement: "L'État paie tout ou partie de vos frais d'avocat et de justice selon vos revenus.",
      description: "Pour un litige (succession, conflit, surendettement...) quand les ressources sont modestes.",
      whyOftenMissed: "Méconnue, alors qu'elle évite de renoncer à faire valoir ses droits faute de moyens.",
      source: { label: "service-public.gouv.fr : aide juridictionnelle", url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F18074" },
      howToApply: {
        organism: "Le tribunal compétent ou un point-justice (France Services, maison de justice)",
        url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F18074",
        sentenceToSay: "Je voudrais demander l'aide juridictionnelle pour ma démarche.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateAideJuridictionnelle,
  },
  {
    aid: {
      id: "tarif-social-telecom",
      name: "Internet et téléphone à tarif social",
      shortName: "Tarif social télécom",
      category: "vie_quotidienne",
      scope: { level: "national" },
      authority: "Opérateurs (offre du service universel, ex. Orange)",
      impact: "coup_de_pouce",
      valueStatement: "Internet et ligne fixe à prix réduit si vous touchez l'ASPA, le RSA ou avez de faibles ressources.",
      description: "Une offre internet à environ 16 € / mois et une ligne fixe à environ 6,50 € / mois pour les foyers modestes.",
      whyOftenMissed: "Très peu connu, alors que la demande est simple une fois l'attestation obtenue.",
      source: {
        label: "service-public.gouv.fr : réduction sociale téléphonique",
        url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1337",
      },
      howToApply: {
        organism: "Votre opérateur (offre sociale), avec une attestation de votre caisse de retraite ou de la CAF",
        url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1337",
        sentenceToSay: "Je voudrais bénéficier de l'offre internet et téléphone à tarif social.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateTarifSocialTelecom,
  },
  {
    aid: {
      id: "sortir-plus",
      name: "Sortir Plus (sorties accompagnées)",
      shortName: "Sortir Plus",
      category: "vie_quotidienne",
      scope: { level: "national" },
      authority: "Agirc-Arrco (action sociale)",
      impact: "coup_de_pouce",
      valueStatement: "Des sorties accompagnées (courses, rendez-vous, promenades) financées, pour ne pas rester isolé(e).",
      description: "Un accompagnement personnalisé pour vos déplacements, dès 75 ans, pour les retraités du privé.",
      whyOftenMissed: "Quasiment invisible, alors qu'il lutte directement contre l'isolement et sans condition de revenus.",
      source: { label: "agirc-arrco.fr : Sortir Plus", url: "https://www.agirc-arrco.fr/mes-services-particuliers/retraites/etre-accompagne-dans-mes-sorties/" },
      howToApply: {
        organism: "Agirc-Arrco (action sociale de votre retraite complémentaire)",
        url: "https://services75ans.agirc-arrco.fr/",
        sentenceToSay: "Je voudrais bénéficier du dispositif Sortir Plus pour des sorties accompagnées.",
      },
      lastVerifiedAt: "2026-09-10",
    },
    evaluate: evaluateSortirPlus,
  },
  {
    aid: {
      id: "point-conseil-budget",
      name: "Point Conseil Budget",
      shortName: "Conseil budget",
      category: "vie_quotidienne",
      scope: { level: "national" },
      authority: "Réseau Point Conseil Budget (labellisé par l'État)",
      impact: "coup_de_pouce",
      valueStatement: "Un conseiller gratuit pour gérer votre budget et retrouver des droits oubliés.",
      description: "Un accompagnement gratuit et confidentiel, pour faire le point ou affronter une difficulté financière.",
      whyOftenMissed: "Récent et peu visible : on ignore qu'un conseiller gratuit peut aussi repérer des aides non réclamées.",
      source: { label: "economie.gouv.fr : Point Conseil Budget", url: "https://www.economie.gouv.fr/cedef/point-conseil-budget-PCB" },
      howToApply: {
        organism: "Un Point Conseil Budget près de chez vous (gratuit)",
        sentenceToSay: "Je voudrais de l'aide pour faire le point sur mon budget.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluatePointConseilBudget,
  },
  {
    aid: {
      id: "surendettement",
      name: "Surendettement (Banque de France)",
      shortName: "Surendettement",
      category: "vie_quotidienne",
      scope: { level: "national" },
      authority: "Banque de France",
      impact: "moyen",
      valueStatement: "Suspendre les poursuites, rééchelonner ou effacer des dettes que vous ne pouvez plus payer.",
      description: "Une procédure gratuite qui protège les personnes débordées par leurs dettes.",
      whyOftenMissed: "Honte et méconnaissance : on ignore que la retraite n'empêche pas de déposer un dossier.",
      source: { label: "banque-france.fr : dossier de surendettement", url: "https://www.banque-france.fr/fr/a-votre-service/particuliers/dossier-surendettement" },
      howToApply: {
        organism: "La commission de surendettement de la Banque de France",
        url: "https://www.banque-france.fr/fr/a-votre-service/particuliers/dossier-surendettement",
        sentenceToSay: "Je voudrais déposer un dossier de surendettement.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateSurendettement,
  },
  {
    aid: {
      id: "droit-au-compte",
      name: "Droit au compte bancaire",
      shortName: "Droit au compte",
      category: "vie_quotidienne",
      scope: { level: "national" },
      authority: "Banque de France",
      impact: "coup_de_pouce",
      valueStatement: "Si une banque vous refuse un compte, une autre devra l'ouvrir, avec des services gratuits.",
      description: "La Banque de France désigne une banque tenue d'ouvrir un compte avec les services bancaires de base.",
      whyOftenMissed: "Très méconnu : après un refus, on renonce au lieu d'exercer ce droit.",
      source: { label: "service-public.gouv.fr : droit au compte", url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2417" },
      howToApply: {
        organism: "La Banque de France (avec l'attestation de refus de la banque)",
        url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2417",
        sentenceToSay: "Je veux exercer mon droit au compte.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateDroitAuCompte,
  },
  {
    aid: {
      id: "microcredit",
      name: "Microcrédit personnel accompagné",
      shortName: "Microcrédit",
      category: "vie_quotidienne",
      scope: { level: "national" },
      authority: "Banque de France / réseaux accompagnants",
      impact: "coup_de_pouce",
      valueStatement: "Un petit prêt à taux modéré quand les banques refusent (mobilité, équipement, santé).",
      description: "Jusqu'à 8 000 €, avec un accompagnement gratuit, pour un projet utile à votre quotidien.",
      whyOftenMissed: "Confondu avec le microcrédit professionnel ; on ne sait pas qu'il passe par le CCAS ou une association.",
      source: { label: "banque-france.fr : le microcrédit", url: "https://www.banque-france.fr/fr/a-votre-service/particuliers/connaitre-pratiques-bancaires-assurance/credit/microcredit" },
      howToApply: {
        organism: "Le CCAS, une association ou un Point Conseil Budget",
        sentenceToSay: "Je voudrais étudier un microcrédit personnel accompagné.",
      },
      lastVerifiedAt: "2026-09-10",
    },
    evaluate: evaluateMicrocredit,
  },
  {
    aid: {
      id: "conciliateur",
      name: "Conciliateur de justice (gratuit)",
      shortName: "Conciliateur",
      category: "vie_quotidienne",
      scope: { level: "national" },
      authority: "Ministère de la Justice",
      impact: "coup_de_pouce",
      valueStatement: "Régler un litige à l'amiable, gratuitement et sans avocat.",
      description: "Voisinage, charges, bail, consommation, impayés : un conciliateur vous aide à trouver un accord.",
      whyOftenMissed: "On croit devoir payer un avocat, alors que la conciliation est gratuite.",
      source: { label: "service-public.gouv.fr : conciliateur", url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1736" },
      howToApply: {
        organism: "Le tribunal, la mairie ou un point-justice (France Services)",
        url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1736",
        sentenceToSay: "Je voudrais saisir un conciliateur de justice pour mon litige.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateConciliateur,
  },
  {
    aid: {
      id: "aide-victimes",
      name: "Aide aux victimes (116 006)",
      shortName: "Aide aux victimes",
      category: "vie_quotidienne",
      scope: { level: "national" },
      authority: "Ministère de la Justice / France Victimes",
      impact: "coup_de_pouce",
      valueStatement: "Une écoute et un accompagnement gratuits si vous êtes victime (arnaque, abus, vol, maltraitance).",
      description: "Le 116 006, gratuit et 7j/7, oriente vers un soutien juridique, psychologique et social.",
      whyOftenMissed: "Les seniors victimes d'escroquerie ou d'abus de faiblesse n'y pensent pas.",
      source: { label: "france-victimes.fr (116 006)", url: "https://www.france-victimes.fr/" },
      howToApply: {
        organism: "Le 116 006 (gratuit, 7j/7) ou une association France Victimes",
        url: "https://www.france-victimes.fr/",
        sentenceToSay: "J'ai été victime, je voudrais être écouté(e) et accompagné(e).",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateAideVictimes,
  },
  {
    aid: {
      id: "seniors-vacances",
      name: "Seniors en Vacances (ANCV)",
      shortName: "Seniors en Vacances",
      category: "vie_quotidienne",
      scope: { level: "national" },
      authority: "ANCV (Agence nationale pour les chèques-vacances)",
      impact: "coup_de_pouce",
      valueStatement: "Des séjours à tarif réduit dès 60 ans, avec une aide si vos revenus sont modestes.",
      description: "Un programme de vacances organisées pour rompre l'isolement, accessible aux aidants aussi.",
      whyOftenMissed: "Confondu avec les chèques-vacances des actifs ; ce programme senior est peu visible.",
      source: { label: "ancv.com : Seniors en Vacances", url: "https://www.ancv.com/seniors-en-vacances-sev" },
      howToApply: {
        organism: "Un porteur de projet (CCAS, association, club de seniors) ou l'ANCV",
        url: "https://www.ancv.com/seniors-en-vacances-sev",
        sentenceToSay: "Je voudrais partir avec le programme Seniors en Vacances.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateSeniorsVacances,
  },
  {
    aid: {
      id: "isolement",
      name: "Rompre l'isolement (visites, écoute)",
      shortName: "Lutte contre l'isolement",
      category: "vie_quotidienne",
      scope: { level: "national" },
      authority: "Associations nationales (MONALISA, Petits Frères des Pauvres)",
      impact: "coup_de_pouce",
      valueStatement: "Des bénévoles pour des visites, des appels et des sorties, gratuitement.",
      description: "Un accompagnement contre la solitude, pour vous ou un proche isolé.",
      whyOftenMissed: "On croit que c'est réservé aux plus démunis ; l'écoute et les visites sont pour tout senior seul.",
      source: { label: "monalisa-asso.fr", url: "https://www.monalisa-asso.fr/" },
      howToApply: {
        organism: "MONALISA, les Petits Frères des Pauvres, ou la ligne Solitud'écoute",
        url: "https://www.monalisa-asso.fr/",
        sentenceToSay: "Je me sens seul(e), je voudrais des visites ou des appels.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateIsolement,
  },
  {
    aid: {
      id: "mandat-protection",
      name: "Mandat de protection future",
      shortName: "Mandat de protection",
      category: "vie_quotidienne",
      scope: { level: "national" },
      authority: "Vous-même (éventuellement avec un notaire)",
      impact: "moyen",
      valueStatement: "Choisir à l'avance qui gérera vos affaires si un jour vous ne le pouvez plus.",
      description: "Un acte préventif qui évite une tutelle subie et protège votre conjoint.",
      whyOftenMissed: "On attend la crise (AVC, maladie) au lieu d'anticiper tant qu'on va bien.",
      source: { label: "service-public.gouv.fr : protection juridique", url: "https://www.service-public.gouv.fr/particuliers/vosdroits/N155" },
      howToApply: {
        organism: "Vous-même (formulaire) ou un notaire",
        url: "https://www.service-public.gouv.fr/particuliers/vosdroits/N155",
        sentenceToSay: "Je voudrais établir un mandat de protection future.",
      },
      lastVerifiedAt: "2026-06-04",
    },
    evaluate: evaluateMandatProtection,
  },
];
