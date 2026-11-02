# Charte design — « Kinshasa la nuit »

Le style s'inspire de la ville (jaune des taxis, terre latérite, fleuve Congo) et des motifs géométriques Kuba du Kasaï. Objectif : une boutique reconnaissable en une seconde, loin des templates génériques.

## À bannir

- Dégradés violet-bleu
- Effet verre flou (glassmorphism)
- Police Inter partout
- Cartes toutes identiques aux coins très arrondis
- Icônes emoji
- Titres creux (« Libérez votre potentiel »)

## Couleurs

| Token        | Nom           | Hex       | Usage                                                 |
| ------------ | ------------- | --------- | ----------------------------------------------------- |
| `--ink`      | Encre de nuit | `#14110F` | Fond mode sombre (mode par défaut)                    |
| `--paper`    | Papier pagne  | `#F4EEE3` | Fond mode clair, reçus                                |
| `--taxi`     | Jaune taxi    | `#F2B705` | Bouton « Payer », prix, badges promo — **uniquement** |
| `--laterite` | Latérite      | `#C2502E` | Ventes flash, nouveautés                              |
| `--fleuve`   | Vert fleuve   | `#1F6F5C` | Confirmations, « Livré », confiance                   |
| `--cendre`   | Cendre        | `#8C8279` | Texte secondaire                                      |

**Règle d'or** : le jaune n'apparaît que sur ce qui fait vendre.

```css
:root {
  --ink: #14110f;
  --paper: #f4eee3;
  --taxi: #f2b705;
  --laterite: #c2502e;
  --fleuve: #1f6f5c;
  --cendre: #8c8279;
}
```

## Typographie

| Rôle                       | Police                    | Source       |
| -------------------------- | ------------------------- | ------------ |
| Titres                     | Bricolage Grotesque (700) | Google Fonts |
| Texte                      | Work Sans (400, 500)      | Google Fonts |
| Prix, codes de transaction | Space Mono                | Google Fonts |

## Formes et signatures

- **Carte produit = ticket** : rectangle avec un coin coupé, perforation pointillée entre visuel et prix
- **Séparateurs** : bandes de motifs Kuba, opacité 10–15 %
- **Photos** : bichromie noir + jaune ou noir + latérite
- **Texture** : léger grain papier sur fonds clairs

## Animations

- Tampon « LIVRÉ » vert qui s'imprime sur le ticket après paiement
- Compteur de vente flash qui « bat » la dernière minute
- Aucune autre animation décorative

## Navigation mobile

Barre en bas, 4 onglets : **Découvrir · Chercher · Ma bibliothèque · Moi**.
Bouton « Payer avec Mobile Money » fixé en bas de la page produit.

## Accessibilité (contraste AA)

Certaines paires de la palette n'atteignent pas 4,5:1 sur du petit texte. Variantes utilisées (vérifiées par `tests/contrast.test.ts`) :

| Token                     | Hex       | Usage                                                                       |
| ------------------------- | --------- | --------------------------------------------------------------------------- |
| `--color-laterite-strong` | `#A8432A` | Fond des badges « Vente flash » / « Nouveau » et du compteur (texte papier) |
| `--color-fleuve-bright`   | `#5CC0A5` | Texte vert sur fond sombre                                                  |
| `--color-cendre-strong`   | `#645B53` | Texte secondaire en mode clair                                              |

- **Prix** : toujours une étiquette jaune taxi avec chiffres encre en Space Mono (le jaune en texte sur papier est illisible).
- **Bichromie** : noir + latérite par défaut, le jaune restant réservé à la vente.
- Cibles tactiles ≥ 44 px, focus visible jaune, `prefers-reduced-motion` respecté.

## Mise en œuvre

Les tokens sont dans `app/globals.css` (Tailwind v4, `@theme`). Les composants sont dans `components/ui/` et tous visibles sur la page `/design`. Mode sombre par défaut, mode clair via `data-theme="light"`, rayon Enfants via la classe `.kids`.
