import { describe, expect, it } from "vitest";
import { QUESTIONS, resolveText, visibleQuestions } from "./questions";
import type { Profile } from "./types";

const question = (id: string) => {
  const found = QUESTIONS.find((q) => q.id === id);
  if (!found) throw new Error(`Question "${id}" introuvable`);
  return found;
};

describe("questionnaire adapté au destinataire (fillingFor)", () => {
  const self: Profile = { fillingFor: "self" };
  const relative: Profile = { fillingFor: "relative" };

  it("parle de l'utilisateur quand il remplit pour lui-même", () => {
    expect(resolveText(question("birthDate").title, self)).toBe("Quelle est votre date de naissance ?");
  });

  it("parle du proche quand l'utilisateur aide quelqu'un (le bug signalé)", () => {
    expect(resolveText(question("birthDate").title, relative)).toBe(
      "Quelle est la date de naissance de votre proche ?",
    );
  });

  it("adapte aussi le texte d'aide, pas seulement le titre", () => {
    expect(resolveText(question("commune").help ?? "", relative)).toContain("sa commune");
    expect(resolveText(question("commune").help ?? "", self)).toContain("votre commune");
  });

  it("revient à la formulation « pour soi » si le destinataire est inconnu", () => {
    expect(resolveText(question("taxStatus").title, {})).toBe(
      "Aujourd'hui, êtes-vous imposable sur le revenu ?",
    );
  });

  it("garde un libellé fixe identique dans les deux cas", () => {
    const help = question("autonomy").help ?? "";
    expect(resolveText(help, self)).toBe(resolveText(help, relative));
  });

  it("propose des réponses neutres (ni « je », ni « vous ») réutilisables dans les deux cas", () => {
    const housing = question("housing");
    if (housing.kind !== "choice") throw new Error("housing devrait être un choix");
    for (const option of housing.options) {
      expect(option.label.toLowerCase()).not.toMatch(/\bje\b|\bvous\b/);
    }
  });
});

describe("question « aidant » conditionnelle (visibleQuestions)", () => {
  const ids = (p: Profile) => visibleQuestions(p).map((q) => q.id);

  it("pose la question quand on remplit pour soi", () => {
    expect(ids({ fillingFor: "self" })).toContain("isCaregiver");
  });

  it("ne la pose pas quand on remplit pour un proche (on est déjà aidant)", () => {
    expect(ids({ fillingFor: "relative" })).not.toContain("isCaregiver");
  });

  it("la pose tant que le destinataire est inconnu", () => {
    expect(ids({})).toContain("isCaregiver");
  });

  it("enregistre la réponse dans le profil (oui/non)", () => {
    const q = question("isCaregiver");
    if (q.kind !== "choice") throw new Error("isCaregiver devrait être un choix");
    expect(q.set({}, "oui").isCaregiver).toBe(true);
    expect(q.set({}, "non").isCaregiver).toBe(false);
    expect(q.get({ isCaregiver: true })).toBe("oui");
  });
});
