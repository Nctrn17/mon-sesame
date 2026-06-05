import { type Profile, updateProfile } from "./types";

/**
 * Définition déclarative du questionnaire. Une question par écran, en
 * langage clair. La logique de rendu (le wizard) se contente d'interpréter
 * ces objets, ce qui rend l'ajout / la réécriture d'une question triviale.
 */

export interface ChoiceOption {
  readonly value: string;
  readonly label: string;
  readonly hint?: string;
}

interface BaseQuestion {
  readonly id: string;
  readonly title: string;
  readonly help?: string;
}

export interface ChoiceQuestion extends BaseQuestion {
  readonly kind: "choice";
  readonly options: readonly ChoiceOption[];
  readonly get: (p: Profile) => string | undefined;
  readonly set: (p: Profile, value: string) => Profile;
}

export interface DateQuestion extends BaseQuestion {
  readonly kind: "date";
  readonly get: (p: Profile) => string | undefined;
  readonly set: (p: Profile, value: string) => Profile;
}

export interface CommuneQuestion extends BaseQuestion {
  readonly kind: "commune";
}

export type Question = ChoiceQuestion | DateQuestion | CommuneQuestion;

const boolGet =
  (read: (p: Profile) => boolean | undefined) =>
  (p: Profile): string | undefined => {
    const v = read(p);
    return v === undefined ? undefined : v ? "oui" : "non";
  };

const OUI_NON: readonly ChoiceOption[] = [
  { value: "oui", label: "Oui" },
  { value: "non", label: "Non" },
];

export const QUESTIONS: readonly Question[] = [
  {
    id: "fillingFor",
    kind: "choice",
    title: "Pour qui remplissez-vous ce questionnaire ?",
    options: [
      { value: "self", label: "Pour moi-même" },
      { value: "relative", label: "Pour un proche que j'aide" },
    ],
    get: (p) => p.fillingFor,
    set: (p, v) => updateProfile(p, { fillingFor: v as Profile["fillingFor"] }),
  },
  {
    id: "birthDate",
    kind: "date",
    title: "Quelle est votre date de naissance ?",
    help: "Elle sert à repérer les droits qui s'ouvrent à 60, 62, 65 ou 75 ans.",
    get: (p) => p.birthDate,
    set: (p, v) => updateProfile(p, { birthDate: v }),
  },
  {
    id: "retirement",
    kind: "choice",
    title: "Où en êtes-vous de la retraite ?",
    help: "Beaucoup de droits s'ouvrent au moment du départ à la retraite, quand les revenus baissent.",
    options: [
      { value: "retraite", label: "Je suis déjà à la retraite" },
      { value: "bientot", label: "J'y serai bientôt" },
      { value: "actif", label: "Je travaille encore" },
    ],
    get: (p) => p.retirement,
    set: (p, v) => updateProfile(p, { retirement: v as Profile["retirement"] }),
  },
  {
    id: "commune",
    kind: "commune",
    title: "Dans quelle commune habitez-vous ?",
    help: "Beaucoup d'aides dépendent de votre commune ou de votre département.",
  },
  {
    id: "maritalSituation",
    kind: "choice",
    title: "Vivez-vous seul(e) ou en couple ?",
    options: [
      { value: "seul", label: "Seul(e)" },
      { value: "couple", label: "En couple" },
    ],
    get: (p) => p.maritalSituation,
    set: (p, v) => updateProfile(p, { maritalSituation: v as Profile["maritalSituation"] }),
  },
  {
    id: "recentlyWidowed",
    kind: "choice",
    title: "Avez-vous perdu votre conjoint au cours des dernières années ?",
    help: "Le veuvage ouvre des droits (pension de réversion) souvent oubliés.",
    options: OUI_NON,
    get: boolGet((p) => p.recentlyWidowed),
    set: (p, v) => updateProfile(p, { recentlyWidowed: v === "oui" }),
  },
  {
    id: "taxStatus",
    kind: "choice",
    title: "Aujourd'hui, êtes-vous imposable sur le revenu ?",
    help: "Votre dernier avis d'imposition l'indique. Nous ne demandons aucun montant.",
    options: [
      { value: "imposable", label: "Oui, je paie l'impôt sur le revenu" },
      { value: "non_imposable", label: "Non, je ne suis pas imposable" },
      { value: "inconnu", label: "Je ne sais pas" },
    ],
    get: (p) => p.taxStatus,
    set: (p, v) => updateProfile(p, { taxStatus: v as Profile["taxStatus"] }),
  },
  {
    id: "housing",
    kind: "choice",
    title: "Votre logement, c'est...",
    options: [
      { value: "proprietaire", label: "Je suis propriétaire" },
      { value: "locataire", label: "Je suis locataire" },
      { value: "heberge", label: "Je suis hébergé(e) chez un proche" },
      { value: "etablissement", label: "Je vis en établissement (EHPAD, résidence)" },
    ],
    get: (p) => p.housing,
    set: (p, v) => updateProfile(p, { housing: v as Profile["housing"] }),
  },
  {
    id: "autonomy",
    kind: "choice",
    title: "Au quotidien, avez-vous besoin d'aide ?",
    help: "Pour se laver, s'habiller, se déplacer ou préparer les repas. Répondez au plus juste.",
    options: [
      { value: "jamais", label: "Jamais, je suis autonome" },
      { value: "parfois", label: "Parfois, pour certaines tâches" },
      { value: "souvent", label: "Souvent" },
      { value: "quotidien", label: "Tous les jours" },
    ],
    get: (p) => p.autonomy,
    set: (p, v) => updateProfile(p, { autonomy: v as Profile["autonomy"] }),
  },
  {
    id: "disability",
    kind: "choice",
    title: "Avez-vous une reconnaissance de handicap ou d'invalidité ?",
    help: "Par exemple l'AAH, une carte mobilité inclusion ou une pension d'invalidité.",
    options: OUI_NON,
    get: boolGet((p) => p.disability),
    set: (p, v) => updateProfile(p, { disability: v === "oui" }),
  },
  {
    id: "usesHomeHelp",
    kind: "choice",
    title: "Payez-vous une aide à domicile, une téléassistance ou un service à la personne ?",
    help: "Ménage, aide à la personne, jardinage, téléassistance... Même occasionnel. Cela ouvre droit à un crédit d'impôt.",
    options: OUI_NON,
    get: boolGet((p) => p.usesHomeHelp),
    set: (p, v) => updateProfile(p, { usesHomeHelp: v === "oui" }),
  },
  {
    id: "scheme",
    kind: "choice",
    title: "Votre retraite vient de quel régime ?",
    help: "Si votre carrière a mêlé plusieurs régimes (privé, public...), choisissez « Carrière mixte ». Cela sert juste à vous orienter vers la bonne caisse.",
    options: [
      { value: "general", label: "Le privé (régime général, salarié)" },
      { value: "fonction_publique", label: "La fonction publique" },
      { value: "agricole", label: "Le régime agricole (MSA)" },
      { value: "mixte", label: "Une carrière mixte (privé et public, ou plusieurs régimes)" },
      { value: "inconnu", label: "Je ne sais pas" },
    ],
    get: (p) => p.scheme,
    set: (p, v) => updateProfile(p, { scheme: v as Profile["scheme"] }),
  },
];
