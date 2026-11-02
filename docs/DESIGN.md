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

| Token | Nom | Hex | Usage |
| --- | --- | --- | --- |
| `--ink` | Encre de nuit | `#14110F` | Fond mode sombre (mode par défaut) |
| `--paper` | Papier pagne | `#F4EEE3` | Fond mode clair, reçus |
| `--taxi` | Jaune taxi | `#F2B705` | Bouton « Payer », prix, badges promo — **uniquement** |
| `--laterite` | Latérite | `#C2502E` | Ventes flash, nouveautés |
| `--fleuve` | Vert fleuve | `#1F6F5C` | Confirmations, « Livré », confiance |
| `--cendre` | Cendre | `#8C8279` | Texte secondaire |

**Règle d'or** : le jaune n'apparaît que sur ce qui fait vendre.

```css
:root {
  --ink: #14110F;
  --paper: #F4EEE3;
  --taxi: #F2B705;
  --laterite: #C2502E;
  --fleuve: #1F6F5C;
  --cendre: #8C8279;
}
```

## Typographie

| Rôle | Police | Source |
| --- | --- | --- |
| Titres | Bricolage Grotesque (700) | Google Fonts |
| Texte | Work Sans (400, 500) | Google Fonts |
| Prix, codes de transaction | Space Mono | Google Fonts |

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
