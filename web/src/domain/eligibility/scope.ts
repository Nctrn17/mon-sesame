import type { Commune } from "@/domain/geo/types";
import type { TerritoryScope } from "@/domain/aids/types";

/**
 * Détermine si une aide (par son périmètre) concerne la commune du profil.
 * Le national s'applique toujours ; le local dépend du rattachement géo.
 */
export function scopeApplies(scope: TerritoryScope, commune?: Commune): boolean {
  switch (scope.level) {
    case "national":
      return true;
    case "region":
      return commune?.codeRegion === scope.code;
    case "departement":
      return commune?.codeDepartement === scope.code;
    case "epci":
      return commune?.codeEpci === scope.code;
    case "commune":
      return commune?.code === scope.code;
  }
}
