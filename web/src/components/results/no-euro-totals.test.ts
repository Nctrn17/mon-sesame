import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Règle produit : public fragile, jamais de promesse chiffrée globale.
 * Le moteur calcule des estimations (pour hiérarchiser), mais aucun composant
 * de la vue résultats ne doit les afficher. Ce test empêche qu'un futur
 * composant les rende par inadvertance.
 */
const FORBIDDEN = [
  "totalAnnualPotential",
  "totalRetroactivePotential",
  "retroactiveEstimate",
  "estimatedAnnualAmount",
  "estimatedAmountLabel",
];

// Aucune exception : le montant exact ASPA (OpenFisca) n'est plus proposé dans l'interface.
const ALLOWED_FILES = new Set<string>();

describe("vue résultats : aucun montant global en euros", () => {
  const dir = join(__dirname);
  const files = readdirSync(dir).filter((f) => f.endsWith(".tsx") && !ALLOWED_FILES.has(f));

  it.each(files)("%s n'affiche aucune estimation chiffrée", (file) => {
    const source = readFileSync(join(dir, file), "utf-8");
    for (const token of FORBIDDEN) {
      expect(source, `${file} référence ${token}`).not.toContain(token);
    }
  });
});
