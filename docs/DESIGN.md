# Design de l'application

Le design suit la **maquette mobile** fournie par le propriétaire du projet
(Design « Maquette boutique mobile » : Accueil, Fiche produit, Explorer, Panier, Bibliothèque, Compte).
Il remplace la charte « Kinshasa la nuit » de la phase 1 (fond sombre, jaune taxi, tickets à coin coupé, motifs Kuba),
à la demande explicite du propriétaire.

## Principes

- **Clair et rassurant** : fond citron très clair, contenus posés sur des cartes blanches arrondies.
- **Une seule action principale par écran**, en bouton noir plein (Acheter, Payer, Obtenir, Télécharger).
- **Prix lisibles** : montant en gras, ancien prix barré en gris, remise en rouge.
- **Mobile d'abord** : barre de navigation en bas, barre d'achat fixe sur la fiche produit et le panier.

## Couleurs

| Token                 | Hex       | Usage                                                         |
| --------------------- | --------- | ------------------------------------------------------------- |
| `--color-lime`        | `#E8F5C0` | Fond de l'application                                         |
| `--color-ink`         | `#14161A` | Texte, boutons principaux, bandeaux promo                     |
| blanc                 | `#FFFFFF` | Cartes                                                        |
| `--color-slate`       | `#565B63` | Texte secondaire                                              |
| `--color-leaf`        | `#4D7C0F` | Liens sur carte blanche, vendeur, coches                      |
| `--color-leaf-strong` | `#3F6212` | « Gratuit », liens sur fond citron                            |
| `--color-promo`       | `#D92D20` | Remises, ventes flash, compte à rebours                       |
| `--color-lime-strong` | `#C5E86C` | Accent sur fond noir (bandeau promo, bouton « Voir le pack ») |
| `--color-star`        | `#E8A100` | Étoiles de note                                               |
| `--color-cloud`       | `#F2F3F5` | Emplacements d'image, séparateurs                             |
| `--color-mint`        | `#F7FBEA` | Bandeau d'information dans une carte                          |
| `--color-steel`       | `#C9CDD3` | Bordures de champs et boutons secondaires                     |

Écarts volontaires avec la maquette, pour l'accessibilité (contraste AA, vérifié par `tests/contrast.test.ts`) :

- prix barré : `#6B7280` au lieu de `#8A8F98` (3,2:1 → 4,8:1 sur blanc) ;
- liens posés directement sur le fond citron : `#3F6212` au lieu de `#4D7C0F` (4,1:1 → 5,7:1).

Un **mode sombre** reste disponible dans Compte › Réglages (fond `#0F1210`, cartes `#1A1E1B`, accent citron).

## Typographie

Une seule famille : **Inter** (400 à 700), auto-hébergée, un seul fichier de 28 Ko (`app/fonts/`).

| Rôle                   | Taille / graisse                        |
| ---------------------- | --------------------------------------- |
| Titre d'écran          | 22 px, 700                              |
| Titre de section       | 16 px, 700                              |
| Nom de produit (liste) | 14 px, 600                              |
| Texte secondaire       | 12–13 px, 400                           |
| Prix                   | 15 px, 700 (26 px sur la fiche produit) |

## Formes

- Cartes : rayon 10 px, fond blanc, sans ombre.
- Boutons : rayon 6–8 px ; principal noir plein, secondaire blanc bordé de noir.
- Puces de filtre : rayon 6 px ; sélectionnée = noire, sinon blanche bordée.
- Icônes d'application : rayon ≈ 22 % ; images et pochettes : 6 px.
- Icônes au trait (SVG maison), jamais d'emoji.

## Navigation

- Barre en bas, 5 onglets : **Accueil · Explorer · Bibliothèque · Panier · Compte** (pastille noire = nombre d'articles).
- En-tête : logo `digistore.`, bascule **$ / FC**, panier.
- Fiche produit et panier : la barre est remplacée par une **barre d'action fixe** (favori, « Ajouter au panier », « Acheter 1,49 $ » / « Payer 2,38 $ et télécharger »).

## Écrans

| Écran         | Contenu                                                                                                                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accueil       | Recherche, filtres par type, bandeau promo noir, catégories, gratuits populaires, offres de la semaine (compte à rebours jusqu'au vendredi), images, musique (extraits), rayons Livres de l'auteur / Tendance / Créateurs congolais |
| Explorer      | Recherche tolérante aux fautes, type, prix (Tous / Gratuits / Payants), tri                                                                                                                                                         |
| Fiche produit | Icône, vendeur, chiffres clés, version (Android / Windows / Navigateur), prix, aperçus, avantages, Offrir, WhatsApp, à propos, détails, avis                                                                                        |
| Panier        | Articles, code promo, Mobile Money / carte, totaux, paiement jusqu'au tampon « LIVRÉ »                                                                                                                                              |
| Bibliothèque  | Bandeau de confirmation noir, filtres, Télécharger / Ouvrir, hors-ligne                                                                                                                                                             |
| Compte        | Statistiques, contrôle parental (âge + code PIN), favoris, réglages, langue, devenir vendeur                                                                                                                                        |

## Animations

- Tampon « LIVRÉ » à la fin du paiement ; compteur qui « bat » la dernière minute.
- `prefers-reduced-motion` respecté.

## Mise en œuvre

Tokens dans `app/globals.css` (Tailwind v4, `@theme`) ; composants dans `components/ui/`, tous visibles sur la page `/design`.
Cibles tactiles ≥ 44 px, focus visible vert, textes en AA minimum.
