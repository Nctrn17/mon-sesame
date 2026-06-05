# Service OpenFisca-France (couche nationale exacte)

Ce service fournit les **montants nationaux exacts** (ASPA, et plus tard ASI,
CSS, APL...) à partir du modèle socio-fiscal officiel
[OpenFisca-France](https://github.com/openfisca/openfisca-france), maintenu et
revalorisé chaque année par l'administration.

L'application web l'interroge via la route interne `/api/openfisca/aspa`. Si ce
service n'est pas lancé, l'application **continue de fonctionner** et bascule
sur ses estimations locales (dégradation gracieuse).

## Lancer le service

> Note Windows : l'API web d'OpenFisca s'appuie sur gunicorn, qui ne tourne pas
> nativement sous Windows. Utilisez **WSL2**, une **machine Linux**, ou un
> **conteneur Docker**. L'app web, elle, tourne nativement sous Windows et n'a
> pas besoin de ce service pour les estimations.

```bash
python3 -m venv .venv
source .venv/bin/activate         # sous WSL/Linux/macOS
pip install -r requirements.txt
openfisca serve --country-package openfisca_france --port 5000
```

Puis, côté application web, renseignez l'URL dans `web/.env.local` :

```
OPENFISCA_URL=http://localhost:5000
```

## Vérifier

```bash
curl http://localhost:5000/spec   # doit répondre la spec OpenAPI du modèle
```

## Pourquoi ce choix

- On **délègue la veille légale** : barèmes et seuils nationaux à jour sans
  maintenance manuelle de notre part.
- On reste **consommateur de l'API non modifiée**, ce qui limite l'exposition à
  la licence AGPL d'OpenFisca (à faire valider juridiquement avant production).
- Le **local** (CCAS, Améthyste, départemental) reste géré côté application, là
  où les moteurs nationaux ne couvrent pas.
