import { describe, expect, it } from "vitest";
import type { Commune } from "@/domain/geo/types";
import type { Profile } from "@/domain/profile/types";
import { buildReport } from "./engine";
import type { AidResult } from "./types";

const REF = new Date("2026-06-04");

const PARIS: Commune = {
  code: "75056",
  nom: "Paris",
  codesPostaux: ["75001"],
  codeDepartement: "75",
  codeRegion: "11",
};

const LYON: Commune = {
  code: "69123",
  nom: "Lyon",
  codesPostaux: ["69001"],
  codeDepartement: "69",
  codeRegion: "84",
};

function find(results: readonly AidResult[], id: string): AidResult | undefined {
  return results.find((r) => r.aid.id === id);
}

describe("buildReport, cas type d'une retraitée parisienne modeste", () => {
  const profile: Profile = {
    fillingFor: "self",
    birthDate: "1960-01-10", // 66 ans
    commune: PARIS,
    maritalSituation: "seul",
    recentlyWidowed: false,
    taxStatus: "non_imposable",
    housing: "locataire",
    autonomy: "jamais",
    disability: false,
    scheme: "general",
  };

  const report = buildReport(profile, REF);

  it("détecte le forfait Améthyste comme éligible avec un manque à gagner passé", () => {
    const amethyste = find(report.results, "amethyste-idf");
    expect(amethyste?.status).toBe("eligible");
    expect(amethyste?.retroactiveEstimate ?? 0).toBeGreaterThan(0);
  });

  it("détecte l'ASPA et la CSS comme éligibles", () => {
    expect(find(report.results, "aspa")?.status).toBe("eligible");
    expect(find(report.results, "css")?.status).toBe("eligible");
  });

  it("évite le double comptage transport (Navigo Senior en repli)", () => {
    expect(find(report.results, "navigo-senior-idf")?.status).toBe("to_check");
  });

  it("exclut la taxe foncière pour un locataire", () => {
    expect(find(report.results, "taxe-fonciere")?.status).toBe("not_eligible");
  });

  it("agrège un potentiel annuel et un rétroactif strictement positifs", () => {
    expect(report.totalAnnualPotential).toBeGreaterThan(0);
    expect(report.totalRetroactivePotential).toBeGreaterThan(0);
  });
});

describe("buildReport, portée territoriale", () => {
  it("n'affiche pas les aides Île-de-France hors Île-de-France", () => {
    const profile: Profile = {
      birthDate: "1955-05-05",
      commune: LYON,
      taxStatus: "non_imposable",
      housing: "locataire",
      autonomy: "jamais",
    };
    const report = buildReport(profile, REF);
    expect(find(report.results, "amethyste-idf")).toBeUndefined();
    expect(find(report.results, "navigo-senior-idf")).toBeUndefined();
    // mais les aides nationales restent présentes
    expect(find(report.results, "aspa")).toBeDefined();
  });
});

describe("buildReport, propriétaire âgé non imposable", () => {
  it("ouvre l'exonération de taxe foncière à partir de 75 ans", () => {
    const profile: Profile = {
      birthDate: "1948-02-02", // 78 ans
      commune: LYON,
      taxStatus: "non_imposable",
      housing: "proprietaire",
      autonomy: "jamais",
    };
    const report = buildReport(profile, REF);
    expect(find(report.results, "taxe-fonciere")?.status).toBe("eligible");
  });
});
