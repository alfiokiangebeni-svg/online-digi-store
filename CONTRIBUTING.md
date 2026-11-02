# Contribuer à Digi Store

## Branches

- `main` : production, protégée
- `dev` : intégration
- `feat/<sujet>`, `fix/<sujet>` : travail en cours

## Commits

Format court en français : `feat: paiement Airtel Money`, `fix: lien expiré en bibliothèque`.

## Avant d'ouvrir une Pull Request

- [ ] `npm run lint` et `npm run build` passent
- [ ] Aucune clé secrète dans le code
- [ ] Respect de la charte ([docs/DESIGN.md](docs/DESIGN.md)) : le jaune taxi uniquement sur les éléments de vente
- [ ] Page testée sur mobile en 3G simulée (< 1 Mo)
- [ ] Toute modification du paiement testée en sandbox (voir [docs/PAIEMENT-MOBILE-MONEY.md](docs/PAIEMENT-MOBILE-MONEY.md))
