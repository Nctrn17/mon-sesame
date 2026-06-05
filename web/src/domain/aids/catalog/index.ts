import type { AidDefinition } from "@/domain/aids/types";
import { aidantDefinitions } from "./aidant";
import { autonomieDefinitions } from "./autonomie";
import { energieDefinitions } from "./energie";
import { fiscalDefinitions } from "./fiscal";
import { handicapDefinitions } from "./handicap";
import { logementDefinitions } from "./logement";
import { minimaDefinitions } from "./minima";
import { preventionDefinitions } from "./prevention";
import { retraiteDefinitions } from "./retraite";
import { santeDefinitions } from "./sante";
import { transportIdfDefinitions } from "./transport-idf";
import { transportNationalDefinitions } from "./transport-national";
import { veuvageDefinitions } from "./veuvage";
import { vieQuotidienneDefinitions } from "./vie-quotidienne";

/**
 * Catalogue complet des aides. Pour étendre la couverture (nouveau type
 * d'aide ou nouveau territoire), on ajoute des définitions ici : le moteur
 * d'éligibilité n'a pas à changer.
 */
export const CATALOG: readonly AidDefinition[] = [
  ...minimaDefinitions,
  ...santeDefinitions,
  ...preventionDefinitions,
  ...energieDefinitions,
  ...autonomieDefinitions,
  ...logementDefinitions,
  ...fiscalDefinitions,
  ...transportNationalDefinitions,
  ...transportIdfDefinitions,
  ...handicapDefinitions,
  ...aidantDefinitions,
  ...veuvageDefinitions,
  ...vieQuotidienneDefinitions,
  ...retraiteDefinitions,
];
