# Design de l'application

Style **place de marché** : un rendu propre et dense, inspiré des grandes plateformes d'achat en ligne
(sans reprendre leurs logos, noms ni couleurs signature). Il remplace le design « maquette citron »
et la charte « Kinshasa la nuit » des étapes précédentes, à la demande du propriétaire.

## Principes

- **Chercher d'abord** : en-tête bleu nuit fixe avec une grande barre de recherche (bouton orange) et des filtres en pastilles.
- **Le prix se voit** : montant en rouge-orangé, ancien prix barré, remise en pastille rouge.
- **Preuve sociale** : note, nombre de ventes, « x % vendus » sur les ventes flash.
- **Acheter vite** : bouton rond d'ajout rapide sur chaque carte, « Ajouter au panier » + « Acheter maintenant » fixés en bas de la fiche.
- **Promotions** : ventes flash avec compte à rebours (vendredi 23 h 59, heure de Kinshasa), coupons à récupérer, appliqués tout seuls au panier.

## Couleurs

| Token              | Hex                   | Usage                                                              |
| ------------------ | --------------------- | ------------------------------------------------------------------ |
| `--color-ink`      | `#0B1F3A`             | En-tête, bandeaux (bleu nuit)                                      |
| `--color-cta`      | `#FF7A1A`             | Action principale (texte foncé `#0F1111` dessus : contraste 5,9:1) |
| `--color-cta-soft` | `#FFE8D6`             | « Ajouter au panier »                                              |
| `--color-price`    | `#CC2E0A`             | Prix                                                               |
| `--color-promo`    | `#E1251B`             | Remises, ventes flash, coupons                                     |
| `--color-leaf`     | `#067D62`             | Gratuit, confirmations, livraison                                  |
| `--color-link`     | `#0B57D0`             | Liens « Tout voir »                                                |
| `--color-star`     | `#FFA41C`             | Étoiles                                                            |
| `--color-mint`     | `#FFF4EC`             | Bandeaux d'information                                             |
| fond               | `#F1F2F4`             | Fond de l'application                                              |
| texte              | `#0F1111` / `#565959` | Texte principal / secondaire                                       |

Tous les couples texte/fond sont vérifiés AA par `tests/contrast.test.ts`. Mode sombre disponible dans Compte › Réglages.

## Typographie et formes

- Une seule police : **Inter** 400–700 (28 Ko, auto-hébergée, avec ɛ et ɔ pour le lingala).
- Cartes blanches, rayon 8 px, ombre très légère ; visuels produits carrés.
- Boutons d'achat en pilule (rayon complet) ; pastilles de filtre arrondies.
- Icônes au trait (SVG maison), jamais d'emoji.

## Écrans

| Écran         | Contenu                                                                                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accueil       | Recherche + filtres (en-tête), avantages (livraison instantanée, Mobile Money, WhatsApp), bandeau promo, catégories rondes, ventes flash (« x % vendus »), coupons du jour, gratuits populaires, musique avec extraits, grille « Recommandé pour vous » |
| Explorer      | Recherche tolérante aux fautes, type, prix, tri                                                                                                                                                                                                         |
| Fiche produit | Galerie, prix, note et ventes, chiffres clés, version, livraison et garantie, vendeur, avantages, offrir, WhatsApp, détails, avis, produits similaires en grille                                                                                        |
| Panier        | Articles, coupon (auto), Mobile Money / carte, totaux, bouton fixe « Payer … et télécharger »                                                                                                                                                           |
| Bibliothèque  | Bandeau de confirmation, filtres, téléchargement, hors-ligne                                                                                                                                                                                            |
| Compte        | Statistiques, contrôle parental + PIN, favoris, réglages (devise, thème, données légères), langue                                                                                                                                                       |

## Navigation

- En-tête : logo `digistore.`, bascule **$ / FC**, panier (pastille orange).
- Barre du bas, 5 onglets : **Accueil · Explorer · Bibliothèque · Panier · Compte** (icône active en orange).

## Mise en œuvre

Tokens dans `app/globals.css` (Tailwind v4), composants dans `components/ui/` et `components/shop/`, tous visibles sur `/design`.
Cibles tactiles ≥ 44 px, focus visible orange, `prefers-reduced-motion` respecté.
