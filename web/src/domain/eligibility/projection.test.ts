import { describe, expect, it } from "vitest";
import type { Commune } from "@/domain/geo/types";
import type { Profile } from "@/domain/profile/types";
import { buildReport } from "./engine";
import { projectToRetirement } from "./projection";
import type { AidResult } from "./types";

const REF = new Date("2026-06-04");

const PARIS: Commune = {
  code: "75056",
  nom: "Paris",
  codesPostaux: ["75001"],
  codeDepartement: "75",
  codeRegion: "11",
};

function find(results: readonly AidResult[], id: string): AidResult | undefined {
  return results.find((r) => r.aid.id === id);
}

describe("projection au passage à la retraite", () => {
  // Personne encore en activité, imposable aujourd'hui.
  const actif: Profile = {
    birthDate: "1959-01-01", // 67 ans
    commune: PARIS,
    taxStatus: "imposable",
    maritalSituation: "seul",
    housing: "locataire",
    autonomy: "jamais",
    retirement: "actif",
  };

  it("aujourd'hui imposable : l'ASPA n'est pas ouverte", () => {
    expect(find(buildReport(actif, REF).results, "aspa")?.status).toBe("not_eligible");
  });

  it("projeté à la retraite (revenus en baisse) : l'ASPA et la CSS s'ouvrent", () => {
    const future = buildReport(projectToRetirement(actif), REF);
    expect(find(future.results, "aspa")?.status).toBe("eligible");
    expect(find(future.results, "css")?.status).toBe("eligible");
  });

  it("avec une pension estimée élevée : reste imposable, pas d'ASPA", () => {
    const future = buildReport(projectToRetirement(actif, 2500), REF);
    expect(find(future.results, "aspa")?.status).not.toBe("eligible");
  });

  it("avec une pension estimée modeste : ASPA ouverte avec un montant", () => {
    const future = buildReport(projectToRetirement(actif, 800), REF);
    const aspa = find(future.results, "aspa");
    expect(aspa?.status).toBe("eligible");
    expect(aspa?.estimatedAnnualAmount ?? 0).toBeGreaterThan(0);
  });
});
