# Mon sésame : vos aides de retraité, sans rien laisser passer

Mon sésame révèle aux seniors les aides, exonérations et tarifs réduits auxquels
ils ont droit, adaptés à leur profil. L'objectif : attaquer le **non-recours**
(environ 10 milliards d'euros d'aides non réclamées chaque année en France).

En ligne : https://monsesame.fr

> Origine du projet : une retraitée a découvert tardivement son droit au forfait
> Améthyste (transport gratuit dès 60 ans en Île-de-France), après des années de
> manque à gagner. Personne ne le lui avait jamais dit. Mon sésame existe pour que
> ça n'arrive plus.

## Ce que fait l'application

1. Un questionnaire court (une question par écran, langage clair, accessible).
2. Un moteur d'éligibilité qui croise le profil avec un catalogue d'aides.
3. Une page de résultats : aides éligibles / à vérifier / non retenues, avec
   pour chacune le bon
   guichet, et la démarche concrète.

## Architecture (hybride)

- **Couche nationale exacte** : service OpenFisca-France (`services/openfisca`),
  interrogé via `/api/openfisca/aspa`, pour les montants nationaux exacts. On
  hérite ainsi de la veille légale officielle. Dégradation gracieuse si absent.
- **Couche locale + orchestration** : règles d'éligibilité TypeScript
  (`web/src/domain`), avec des barèmes datés et sourcés, conçues pour migrer
  vers Publicodes. C'est ici que vivent les aides locales (Améthyste, etc.).
- **Géo abstraite** commune -> EPCI -> département -> région -> national (via
  `geo.api.gouv.fr`). Passer de l'Île-de-France à toute la France = ajouter des
  définitions d'aides, jamais réécrire le moteur.

Voir `docs/architecture.md` et `docs/aides-catalogue.md`.

## Structure du dépôt

```
web/                 Application Next.js (le produit)
  src/domain/        Logique métier pure (profil, aides, éligibilité, géo)
  src/components/    Interface (questionnaire, résultats)
  src/app/           Pages et routes API
services/openfisca/  Service Python OpenFisca-France (couche nationale)
docs/                Architecture et catalogue d'aides
```

## Démarrer

```bash
cd web
cp .env.example .env.local   # variables optionnelles, voir le fichier
npm install
npm run dev        # http://localhost:3000
npm test           # tests de la logique d'éligibilité
npm run build      # build de production
```

Le service OpenFisca est **optionnel** en développement (voir
`services/openfisca/README.md`). Sans lui, l'application affiche ses estimations.

## Statut

- Couverture actuelle : aides nationales + Île-de-France (premier pack
  territoire). Objectif : toute la France.
- Compte optionnel (sauvegarde + alertes) et migration des règles vers
  Publicodes : prévus en V1.

## Avertissement

Les résultats sont des **estimations non contractuelles**. Seuls les organismes
compétents décident de l'attribution et du montant des aides.

## Licence

Code publié sous licence [AGPL-3.0](LICENSE). Les textes et barèmes des aides
proviennent des sources officielles citées dans chaque fiche.
