# Architecture

## Principes

1. **Logique métier pure et testable.** Tout le calcul d'éligibilité est en
   fonctions pures (`web/src/domain`), sans dépendance au framework ni à
   l'horloge (la date de référence est injectable). Cela rend les règles
   testables unitairement et faciles à auditer.
2. **National exact + local curé (hybride).** OpenFisca pour les montants
   nationaux exacts ; nos règles pour le local et l'orchestration.
3. **National dès le départ.** Aucune notion d'Île-de-France codée en dur dans
   le moteur. Le territoire est une donnée portée par chaque aide.
4. **Minimisation des données (RGPD).** On préfère des réponses qualitatives
   (imposable oui/non, besoin d'aide jamais/parfois/...) aux montants exacts.

## Couches

```
src/domain/geo/          Modèle géo + client geo.api.gouv.fr (BAN/INSEE)
src/domain/profile/      Profil utilisateur, calcul d'âge, questionnaire déclaratif
src/domain/aids/         Types d'aides, barèmes datés/sourcés, catalogue (1 fichier/catégorie)
src/domain/eligibility/  Moteur (scope + orchestrateur) + intégration OpenFisca
src/components/          Interface (wizard accessible, résultats)
src/app/                 Pages + route API OpenFisca
```

### Le moteur d'éligibilité

`buildReport(profile, referenceDate)` :

1. dérive l'âge,
2. filtre le catalogue par périmètre territorial (`scopeApplies`),
3. exécute la règle (`evaluate`) de chaque aide,
4. agrège le potentiel annuel et le manque à gagner passé,
5. trie (éligible -> à vérifier -> non éligible).

Chaque aide = métadonnées (`Aid`) + règle (`Evaluator`). Ajouter une aide ou un
territoire n'impacte pas le moteur.

### Couche OpenFisca (national exact)

`/api/openfisca/aspa` reçoit un minimum d'informations (date de naissance,
revenu, couple), construit une "situation" OpenFisca (`mapping.ts`) et relaie au
service Python. En cas d'indisponibilité, réponse `available: false` et repli
sur l'estimation locale. Rien n'est stocké côté serveur.

## Fraîcheur des données (stratégie à deux vitesses)

- **National** : déléguer la veille à OpenFisca (revalorisations annuelles
  héritées). En attendant la bascule complète, les barèmes locaux de
  `src/domain/aids/baremes.ts` portent une source et une date de vérification.
- **Local** : curation par fichiers versionnés (1 aide = 1 source + 1
  `lastVerifiedAt`). À industrialiser : alerte CI sur les règles non vérifiées
  depuis plus de 6 à 12 mois, revue annuelle calée sur les budgets locaux.

## Passage à toute la France

- La géo est déjà nationale (`geo.api.gouv.fr` couvre toutes les communes).
- Les aides nationales s'appliquent partout via OpenFisca.
- Le local se cure territoire par territoire : on ajoute des définitions avec le
  bon `scope` (région / département / EPCI / commune). Le moteur ne change pas.

## RGPD (produit public)

- Simulation anonyme par défaut, sans compte.
- Données sensibles (santé via proxy autonomie/handicap) : consentement
  explicite, minimisation, hébergement UE, conservation courte.
- Résultats présentés comme estimations, jamais comme décision (art. 22).
- AIPD recommandée avant mise à l'échelle (santé + finances + public vulnérable).
