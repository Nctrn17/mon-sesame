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

describe("allocation veuvage", () => {
  it("à vérifier pour un veuvage récent avant 55 ans", () => {
    const profile: Profile = {
      birthDate: "1974-01-01",
      commune: LYON,
      recentlyWidowed: true,
    };
    expect(find(buildReport(profile, REF).results, "allocation-veuvage")?.status).toBe("to_check");
  });

  it("non éligible après 55 ans (la réversion prend le relais)", () => {
    const profile: Profile = {
      birthDate: "1960-01-01",
      commune: LYON,
      recentlyWidowed: true,
    };
    expect(find(buildReport(profile, REF).results, "allocation-veuvage")?.status).toBe("not_eligible");
  });
});

describe("solidarité transport IDF", () => {
  it("à vérifier pour un Francilien non imposable", () => {
    const profile: Profile = {
      birthDate: "1962-01-01",
      commune: PARIS,
      taxStatus: "non_imposable",
    };
    expect(find(buildReport(profile, REF).results, "solidarite-transport-idf")?.status).toBe("to_check");
  });

  it("non éligible si imposable", () => {
    const profile: Profile = {
      birthDate: "1962-01-01",
      commune: PARIS,
      taxStatus: "imposable",
    };
    expect(find(buildReport(profile, REF).results, "solidarite-transport-idf")?.status).toBe("not_eligible");
  });

  it("absente du rapport hors Île-de-France", () => {
    const profile: Profile = { birthDate: "1962-01-01", commune: LYON, taxStatus: "non_imposable" };
    expect(find(buildReport(profile, REF).results, "solidarite-transport-idf")).toBeUndefined();
  });
});

describe("droits du proche aidant", () => {
  const base: Profile = { birthDate: "1958-01-01", commune: LYON };

  it("éligible quand on remplit pour un proche (aidant par définition)", () => {
    const profile: Profile = { ...base, fillingFor: "relative" };
    expect(find(buildReport(profile, REF).results, "aidant")?.status).toBe("eligible");
  });

  it("éligible quand on remplit pour soi et qu'on aide un proche", () => {
    const profile: Profile = { ...base, fillingFor: "self", isCaregiver: true };
    expect(find(buildReport(profile, REF).results, "aidant")?.status).toBe("eligible");
  });

  it("non concerné quand on répond ne pas aider de proche", () => {
    const profile: Profile = { ...base, fillingFor: "self", isCaregiver: false };
    expect(find(buildReport(profile, REF).results, "aidant")?.status).toBe("not_eligible");
  });

  it("reste « à vérifier » tant que la question est sans réponse", () => {
    const profile: Profile = { ...base, fillingFor: "self" };
    expect(find(buildReport(profile, REF).results, "aidant")?.status).toBe("to_check");
  });
});

describe("portage de repas à domicile", () => {
  it("à vérifier pour une personne de 65 ans ou plus vivant à domicile", () => {
    const profile: Profile = { birthDate: "1955-01-01", commune: LYON, housing: "locataire" };
    expect(find(buildReport(profile, REF).results, "portage-repas")?.status).toBe("to_check");
  });

  it("non éligible avant 65 ans", () => {
    const profile: Profile = { birthDate: "1963-01-01", commune: LYON, housing: "locataire" };
    expect(find(buildReport(profile, REF).results, "portage-repas")?.status).toBe("not_eligible");
  });

  it("non éligible en établissement (les repas sont fournis)", () => {
    const profile: Profile = { birthDate: "1950-01-01", commune: LYON, housing: "etablissement" };
    expect(find(buildReport(profile, REF).results, "portage-repas")?.status).toBe("not_eligible");
  });

  it("inconnu sans date de naissance", () => {
    const profile: Profile = { commune: LYON, housing: "locataire" };
    expect(find(buildReport(profile, REF).results, "portage-repas")?.status).toBe("unknown");
  });

  it("honnêteté : jamais de montant estimé (prise en charge trop variable)", () => {
    const profile: Profile = { birthDate: "1950-01-01", commune: LYON, housing: "locataire" };
    const portage = find(buildReport(profile, REF).results, "portage-repas");
    expect(portage?.estimatedAnnualAmount).toBeUndefined();
  });
});

describe("statut fiscal inconnu (« je ne sais pas »)", () => {
  it("l'ASPA reste « à vérifier », jamais non éligible", () => {
    const profile: Profile = {
      birthDate: "1958-01-01",
      commune: LYON,
      taxStatus: "inconnu",
      maritalSituation: "seul",
    };
    expect(find(buildReport(profile, REF).results, "aspa")?.status).toBe("to_check");
  });
});
