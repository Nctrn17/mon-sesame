import { describe, expect, it } from "vitest";
import { plainText } from "./plainText";

describe("plainText", () => {
  it("retire les titres markdown", () => {
    expect(plainText("### Objectif\n\nUn texte clair.")).toBe("Objectif Un texte clair.");
  });

  it("retire gras, italique et astérisques échappés", () => {
    expect(plainText("\\*\\**La mission* \\*\\*: **lutter** contre la fracture")).toBe(
      "La mission : lutter contre la fracture",
    );
  });

  it("remplace un lien par son libellé", () => {
    expect(plainText("Voir [le site](http://exemple.fr) pour plus.")).toBe("Voir le site pour plus.");
  });

  it("retire les liens entre chevrons et les commentaires HTML", () => {
    expect(plainText("Contact <http://x.fr> ici.<!-- caché -->")).toBe("Contact ici.");
  });

  it("retire les puces de liste", () => {
    expect(plainText("- premier\n- second")).toBe("premier second");
  });

  it("laisse un texte déjà propre intact", () => {
    expect(plainText("Un centre médico-psychologique pour adultes.")).toBe(
      "Un centre médico-psychologique pour adultes.",
    );
  });

  it("tronque à la fin d'un mot et ajoute une ellipse", () => {
    const long = "mot ".repeat(100).trim();
    const out = plainText(long, 40);
    expect(out).not.toBeNull();
    expect(out!.endsWith("…")).toBe(true);
    expect(out!.length).toBeLessThanOrEqual(41);
    expect(out!).not.toContain(" …");
  });

  it("renvoie null pour une valeur non textuelle", () => {
    expect(plainText(null)).toBeNull();
    expect(plainText(42)).toBeNull();
    expect(plainText(undefined)).toBeNull();
  });

  it("renvoie null pour un texte vide ou uniquement du markdown", () => {
    expect(plainText("   ")).toBeNull();
    expect(plainText("**__**")).toBeNull();
  });
});
