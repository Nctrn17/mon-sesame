import { describe, expect, it } from "vitest";
import { buildReport } from "@/domain/eligibility/engine";
import type { AidResult } from "@/domain/eligibility/types";
import type { Commune } from "@/domain/geo/types";
import type { Profile } from "@/domain/profile/types";

const REF = new Date("2026-06-04");

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

describe("garde-fous d'honnêteté du moteur", () => {
  it("ASPA non éligible quand le revenu fourni dépasse le plafond", () => {
    const profile: Profile = {
      birthDate: "1958-01-01",
      commune: LYON,
      taxStatus: "non_imposable",
      maritalSituation: "seul",
      monthlyIncome: 1500,
    };
    expect(find(buildReport(profile, REF).results, "aspa")?.status).toBe("not_eligible");
  });

  it("ASPA éligible avec un montant positif quand le revenu est sous le plafond", () => {
    const profile: Profile = {
      birthDate: "1958-01-01",
      commune: LYON,
      taxStatus: "non_imposable",
      maritalSituation: "seul",
      monthlyIncome: 700,
    };
    const aspa = find(buildReport(profile, REF).results, "aspa");
    expect(aspa?.status).toBe("eligible");
    expect(aspa?.estimatedAnnualAmount ?? 0).toBeGreaterThan(0);
  });

  it("APA en 'unknown' quand l'autonomie n'est pas renseignée", () => {
    const profile: Profile = { birthDate: "1950-01-01", commune: LYON };
    expect(find(buildReport(profile, REF).results, "apa-domicile")?.status).toBe("unknown");
  });

  it("taxe foncière en 'unknown' quand le logement n'est pas renseigné", () => {
    const profile: Profile = { birthDate: "1945-01-01", commune: LYON, taxStatus: "non_imposable" };
    expect(find(buildReport(profile, REF).results, "taxe-fonciere")?.status).toBe("unknown");
  });

  it("taxe foncière en 'à vérifier' si le statut fiscal est inconnu", () => {
    const profile: Profile = {
      birthDate: "1945-01-01",
      commune: LYON,
      taxStatus: "inconnu",
      housing: "proprietaire",
    };
    expect(find(buildReport(profile, REF).results, "taxe-fonciere")?.status).toBe("to_check");
  });
});
