import { describe, expect, it } from "vitest";
import type { Commune } from "@/domain/geo/types";
import type { Profile } from "@/domain/profile/types";
import { buildReport } from "./engine";
import { countItems, groupResults } from "./grouping";

const REF = new Date("2026-09-11");
const PARIS: Commune = { code: "75056", nom: "Paris", codesPostaux: ["75001"], codeDepartement: "75", codeRegion: "11" };
const MONTREUIL: Commune = { code: "93048", nom: "Montreuil", codesPostaux: ["93100"], codeDepartement: "93", codeRegion: "11" };

describe("groupResults", () => {
  const retraitee: Profile = {
    fillingFor: "self", birthDate: "1950-03-01", commune: PARIS, maritalSituation: "seul",
    taxStatus: "non_imposable", housing: "locataire", autonomy: "parfois", scheme: "general", retirement: "retraite",
  };
  const veuve: Profile = {
    fillingFor: "relative", birthDate: "1940-03-01", commune: MONTREUIL, maritalSituation: "seul", recentlyWidowed: true,
    taxStatus: "non_imposable", housing: "proprietaire", autonomy: "quotidien", scheme: "agricole", retirement: "retraite",
  };

  it("ne garde en tête que les droits à impact élevé ou moyen", () => {
    const g = groupResults(buildReport(retraitee, REF).results);
    for (const grp of [...g.toRequest, ...g.toCheck]) {
      for (const r of grp.items) expect(r.aid.impact).not.toBe("coup_de_pouce");
    }
    for (const grp of g.goodToKnow) {
      for (const r of grp.items) expect(r.aid.impact).toBe("coup_de_pouce");
    }
  });

  it("réduit nettement ce qui est visible d'emblée", () => {
    const report = buildReport(retraitee, REF);
    const flat = report.results.filter((r) => r.status === "eligible" || r.status === "to_check").length;
    const g = groupResults(report.results);
    const visible = countItems(g.toRequest) + countItems(g.toCheck);
    expect(visible).toBeLessThanOrEqual(flat / 2);
    expect(visible + countItems(g.goodToKnow)).toBe(flat);
  });

  it("ne perd aucune aide et ne duplique rien", () => {
    const report = buildReport(veuve, REF);
    const g = groupResults(report.results);
    const ids = [...g.toRequest, ...g.toCheck, ...g.goodToKnow]
      .flatMap((grp) => grp.items.map((r) => r.aid.id))
      .concat(g.other.map((r) => r.aid.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBe(report.results.length);
  });

  it("place l'ASPA dans « Revenus et impôts » et l'APA dans « Autonomie »", () => {
    const g = groupResults(buildReport(veuve, REF).results);
    const find = (id: string) => g.toRequest.find((grp) => grp.items.some((r) => r.aid.id === id))?.theme;
    expect(find("aspa")).toBe("argent");
    expect(g.toRequest.map((grp) => grp.theme)).toEqual([...new Set(g.toRequest.map((grp) => grp.theme))]);
    expect(g.toRequest.some((grp) => grp.theme === "autonomie" && grp.items.some((r) => r.aid.name.startsWith("APA")))).toBe(true);
  });
});
