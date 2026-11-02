# Charte « di.si store »

**di.si store** (toujours en minuscules, avec le point) : plateforme multi-catégories, mobile d'abord, pour la RDC.
Cette charte remplace toutes les palettes précédentes (« Kinshasa la nuit », maquette citron, style place de marché).

Ergonomie inspirée des grandes applications d'achat (recherche toujours visible, double action « Acheter maintenant » + « Ajouter au panier », étoiles et avis partout, grille dense de catégories, ventes flash, badges vendeur) — **sans** reprendre leurs logos, couleurs, images ni textes.

## Fichier de thème unique

Toutes les couleurs, polices, rayons et animations sont définis dans **`app/theme.css`** (Tailwind v4 `@theme`).
`lib/theme.ts` en est le miroir pour le code ; `tests/theme.test.ts` vérifie :

1. que les deux fichiers ont les mêmes valeurs ;
2. que tous les couples texte/fond utilisés atteignent le contraste **AA** ;
3. qu'**aucune couleur n'est écrite en dur** dans les composants (`components/ui`, étendu aux écrans à l'étape 4).

Ambiance : ergonomie des applications mobiles Amazon et AliExpress (recherche en haut, grille de catégories, ventes flash, double action d'achat), sur **fond gris foncé** avec le **vert citron** comme seule couleur forte.

## Couleurs de base (thème sombre unique)

| Token          | Hex       | Classe                               | Usage                                                                       |
| -------------- | --------- | ------------------------------------ | --------------------------------------------------------------------------- |
| primary        | `#B6F23A` | `bg-primary`                         | Actions principales (Acheter, Payer, Postuler, Soumissionner), onglet actif |
| primaryPressed | `#9BD61F` | `bg-primary-pressed`                 | État pressé / survol                                                        |
| background     | `#1C1F1E` | `bg-background` / `bg-bg`            | Fond général                                                                |
| surface        | `#262A28` | `bg-surface`                         | Cartes, feuilles modales, barre du bas                                      |
| surfaceHigh    | `#323735` | `bg-surface-high` / `bg-surface-2`   | Champs, puces, éléments en relief                                           |
| border         | `#3E4441` | `border-border` / `border-line`      | Séparateurs, contours                                                       |
| textPrimary    | `#F2F5F3` | `text-text-primary` / `text-fg`      | Titres et textes                                                            |
| textSecondary  | `#A3ACA7` | `text-text-secondary` / `text-muted` | Descriptions, métadonnées                                                   |
| onPrimary      | `#0E100F` | `text-on-primary`                    | Texte sur le vert citron (**jamais de blanc sur le vert**)                  |

## Couleurs d'appoint — palette minimale

Demande du propriétaire : **vert citron fort, fond gris, pas de surcharge de couleurs**.
Le vert citron est la **seule couleur d'action** ; trois couleurs d'appoint seulement, chacune avec un sens unique :

| Token      | Hex       | Sens                                                                                                                     |
| ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------ |
| urgent     | `#FF4D5E` | Un seul rouge : remises (−30 %), ventes flash, compte à rebours, « Plus que 3 », date limite, erreurs (fonds et icônes)  |
| urgentText | `#FF5E6D` | Le même rouge **en petit texte** (prix barré, messages d'erreur) — l'urgent d'origine n'atteint que 4,48:1 sur une carte |
| star       | `#FFC53D` | **Étoiles de note uniquement**                                                                                           |
| success    | `#2ED3A0` | Paiement réussi, « Livré », candidature envoyée, vendeur vérifié                                                         |

Pas de bleu, d'orange ni de rose. « Nouveau », « Sponsorisé », « Meilleure vente » : badges **neutres** (fond en relief, texte clair).
Sur un fond coloré (badge rouge ou menthe), le texte est toujours `onPrimary` (≥ 5,9:1).

## Catégories

Les 7 catégories (Livres, Applications, Immobilier, Offres d'emploi, Musique, Images, Appels d'offres) n'ont **pas de couleur propre** :
icônes au trait en gris (`textSecondary`), sur fond en relief. Seule l'icône les distingue.

## Règles

- **Un seul bouton vert citron plein** par écran ou par carte (`Button variant="primary"`).
- Boutons secondaires **en contour** (`variant="outline"` : bordure `border`, texte `textPrimary`) ; actions tertiaires en **liens texte** (`variant="ghost"`).
- Onglets et filtres actifs : contour et texte vert citron, sans fond plein.
- Cartes produit : pas de bandeau ni de teinte de catégorie ; visuel en gris relief avec icône neutre.
- Contraste **AA** partout (vérifié par les tests).
- **Interdits** : dégradés violet-bleu, effet verre flou, mises en page « template IA », emoji en guise d'icônes.

## Typographie

| Rôle               | Police                                 | Graisses |
| ------------------ | -------------------------------------- | -------- |
| Titres, logo, prix | **Plus Jakarta Sans** (`font-display`) | 700–800  |
| Texte              | **DM Sans** (`font-sans`)              | 400–700  |

- Auto-hébergées, un fichier variable chacune (`app/fonts/`, 37 Ko au total), générées par `scripts/build-fonts.py`.
- **Prix** : chiffres tabulaires, gras (800), nettement plus grands que le texte (17 px en carte, 30 px sur la fiche).
- ɛ et ɔ (lingala) ne figurent pas dans ces familles : le téléphone les affiche avec sa police système.

## Formes et icônes

- Rayons : 8 px (puces, champs), 10 px (boutons), 12 px (cartes, feuilles).
- **Pas d'ombres** : la profondeur vient des niveaux de gris (background → surface → surfaceHigh).
- Une seule famille d'**icônes au trait** (`components/ui/icons.tsx`), y compris les 7 icônes de catégorie.

## Mouvement

- Retour visuel immédiat à chaque pression (`.pressable` : légère réduction d'échelle).
- **Vibration haptique** légère sur les actions d'achat (`<Button haptic>`), ignorée si « réduire les animations ».
- **Squelettes de chargement** (`Skeleton`, `TicketSkeleton`, `RowSkeleton`) au lieu d'écrans vides ou d'indicateurs sans fin.
- Animation de confirmation (tampon « LIVRÉ ») après paiement, candidature ou soumission.
- `prefers-reduced-motion` respecté partout.

## Navigation (cible de l'étape 4)

- **Barre du bas, 5 onglets** : Accueil · Catégories · Vendre / Publier · Panier · Compte (onglet actif en vert citron).
- **En haut** : logo « di.si store », recherche permanente (vocale et scan quand l'appareil le permet), sélecteur CDF / USD, notifications.
- Support client affiché dans l'application : WhatsApp **+243 824 176 729**.

## Composants

Tous visibles sur la page `/design` : logo, couleurs, typographie, boutons, badges, puces, sélecteurs, champs, cartes produit, lignes de liste, retours (toast, tampon, compte à rebours, feuille modale), squelettes, barre du bas.
