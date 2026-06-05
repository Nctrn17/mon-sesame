import { describe, expect, it } from "vitest";
import { ageAt } from "./age";

describe("ageAt", () => {
  const ref = new Date("2026-06-04");

  it("calcule l'âge avant l'anniversaire dans l'année", () => {
    expect(ageAt("1960-12-25", ref)).toBe(65);
  });

  it("calcule l'âge après l'anniversaire dans l'année", () => {
    expect(ageAt("1960-01-10", ref)).toBe(66);
  });

  it("gère le jour exact de l'anniversaire", () => {
    expect(ageAt("1960-06-04", ref)).toBe(66);
  });

  it("renvoie null pour une date invalide", () => {
    expect(ageAt("pas-une-date", ref)).toBeNull();
  });
});
