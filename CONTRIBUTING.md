# Contribuer à Digi Store

## Branches

- `main` : production, protégée
- `dev` : intégration
- `feat/<sujet>`, `fix/<sujet>` : travail en cours

## Commits

Format court en français : `feat: paiement Airtel Money`, `fix: lien expiré en bibliothèque`.

## Avant d'ouvrir une Pull Request

- [ ] `npm run lint`, `npm run typecheck`, `npm test` et `npm run build` passent
- [ ] `npm run budget` passe (JS de l'accueil < 120 Ko)
- [ ] Aucun texte en dur : tout passe par `lib/i18n/dictionaries/` (fr, ln, en)
- [ ] Nouveaux écrans construits uniquement avec `components/ui/`
- [ ] Aucune clé secrète dans le code
- [ ] Respect du design ([docs/DESIGN.md](docs/DESIGN.md)) : une seule action principale (bouton noir) par écran, contrastes AA
- [ ] Page testée sur mobile en 3G simulée (< 1 Mo)
- [ ] Toute modification du paiement testée en sandbox (voir [docs/PAIEMENT-MOBILE-MONEY.md](docs/PAIEMENT-MOBILE-MONEY.md))
