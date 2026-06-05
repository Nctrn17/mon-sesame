# Catalogue d'aides

## Implémentées (MVP)

Chaque aide porte, dans le code, sa source officielle et une date de
vérification (`lastVerifiedAt`).

| Aide | Catégorie | Périmètre | Pourquoi elle compte |
|------|-----------|-----------|----------------------|
| ASPA (minimum vieillesse) | Revenu | National | ~50 % de non-recours, le plus gros manque à gagner |
| ASI | Revenu | National | Passerelle avant la retraite, très méconnue |
| Complémentaire santé solidaire | Santé | National | Non-recours massif chez les seniors modestes |
| Chèque énergie | Énergie | National | Plus toujours automatique depuis la fin de la taxe d'habitation |
| APA à domicile | Autonomie | National (département) | Idée fausse "trop aisé" : pas de plafond de ressources |
| Action sociale caisse de retraite | Caisse de retraite | National | Aide à domicile GIR 5-6 quasi invisible |
| MaPrimeAdapt' | Logement | National | Adaptation du logement, ouverte dès 70 ans |
| Exonération / dégrèvement taxe foncière | Impôts | National | Perdue après un changement de situation |
| Forfait Améthyste | Transport | Île-de-France | Le cas fondateur : gratuité dès 60 ans, jamais annoncée |
| Forfait Navigo Senior | Transport | Île-de-France | Tarif réduit dès 62 ans, sans condition de ressources |
| Pension de réversion | Veuvage | National | Oubliée au moment du veuvage |

## Prochaines aides (feuille de route)

Issues de la recherche initiale, par ordre d'impact estimé :

- **Fiscal** : abattement 10 % sur pensions, abattement spécial > 65 ans,
  exonération/taux réduit de CSG, crédit d'impôt emploi à domicile (50 %),
  réduction d'impôt frais de dépendance en EHPAD, demi-part (anciens
  combattants, parent isolé).
- **Logement / énergie** : APL/ALS (locataire, EHPAD), aides Anah, MaPrimeRénov',
  FSL, aides chauffage CCAS.
- **Autonomie / santé** : ARDH (retour après hospitalisation, fenêtre courte),
  100 % Santé, mise en ALD, téléassistance subventionnée, cures thermales.
- **Veuvage / handicap** : allocation veuvage, capital décès, frais d'obsèques,
  PCH/AAH et leur articulation avec l'APA/ASPA, carte mobilité inclusion.
- **Aidants** : AJPA (congé proche aidant), droit au répit, Sortir Plus
  (Agirc-Arrco).
- **Local (curation territoire par territoire)** : aides CCAS (secours, colis,
  repas, téléalarme), aides départementales et régionales, transport à la
  demande, gratuités locales.

## Règle de qualité

- Une aide = un libellé clair + une source officielle + une date de
  vérification + un "comment l'obtenir" (le bon guichet, la démarche, la phrase
  à dire).
- Tout montant affiché est une **estimation**. Les montants nationaux exacts
  passeront par OpenFisca.
- Les libellés provenant de sources externes (API, scraping) doivent être
  normalisés à l'affichage (remplacer les tirets longs par des traits courts).
