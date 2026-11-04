# Charte « di.si store »

**di.si store** (toujours en minuscules, avec le point) : plateforme multi-catégories, mobile d'abord, pour la RDC.
Cette charte remplace toutes les palettes précédentes (« Kinshasa la nuit », maquette citron, style place de marché).

Ergonomie inspirée des grandes applications d'achat (recherche toujours visible, double action « Acheter maintenant » + « Ajouter au panier », étoiles et avis partout, grille dense de catégories, ventes flash, badges vendeur) — **sans** reprendre leurs logos, couleurs, images ni textes.

## Fichier de thème unique

Toutes les couleurs, polices, rayons et animations sont définis dans **`app/theme.css`** (Tailwind v4 `@theme`).
`lib/theme.ts` en est le miroir pour le code ; `tests/theme.test.ts` vérifie :

1. que les deux fichiers ont les mêmes valeurs ;
2. que tous les couples texte/fond utilisés atteignent le contraste **AA** ;
3. qu'**aucune couleur n'est écrite en dur** dans les écrans et composants (`app/`, `components/`) : ni hexadécimal, ni `white`/`black`, ni `rgb()`, ni variante `dark:`, ni ancien nom de couleur.

Ambiance : ergonomie des applications mobiles Amazon et AliExpress (recherche en haut, grille de catégories, ventes flash, double action d'achat), en version **claire et aérée** (thème « Lumière » : cartes blanches sur fond gris très clair, grands espacements) avec le **vert citron** comme seule couleur forte. Le logo « di.si store » est posé dans une **grande pastille vert citron**.

## Couleurs de base (thème clair « Lumière »)

| Token          | Hex       | Classe                               | Usage                                                                        |
| -------------- | --------- | ------------------------------------ | ---------------------------------------------------------------------------- |
| primary        | `#B6F23A` | `bg-primary`                         | Boutons d'action (Acheter, Payer, Postuler, Soumissionner), pastille du logo |
| primaryPressed | `#A2DC24` | `bg-primary-pressed`                 | État pressé / survol                                                         |
| primaryText    | `#3A6200` | `text-primary-text`                  | Vert **lisible sur fond clair** : onglet actif, puces actives, liens, focus  |
| background     | `#F3F4F2` | `bg-background` / `bg-bg`            | Fond général (gris très clair)                                               |
| surface        | `#FFFFFF` | `bg-surface`                         | Cartes, en-tête, feuilles modales, barre du bas                              |
| surfaceHigh    | `#EAECE9` | `bg-surface-high` / `bg-surface-2`   | Champs, puces, éléments en relief                                            |
| border         | `#D8DCD7` | `border-border` / `border-line`      | Séparateurs, contours                                                        |
| textPrimary    | `#141816` | `text-text-primary` / `text-fg`      | Titres et textes ; fond des bannières sombres de l'accueil                   |
| textSecondary  | `#555D58` | `text-text-secondary` / `text-muted` | Descriptions, métadonnées                                                    |
| onPrimary      | `#0E100F` | `text-on-primary`                    | Texte sur le vert citron (**jamais de blanc sur le vert citron**)            |
| onAccent       | `#FFFFFF` | `text-on-accent`                     | Texte blanc sur le rouge et le vert succès, et sur les bannières sombres     |

Ombre très légère des cartes : `--shadow-card` (la seule ombre de l'application).

## Couleurs d'appoint — palette minimale

Demande du propriétaire : **vert citron fort, fond gris, pas de surcharge de couleurs**.
Le vert citron est la **seule couleur d'action** ; trois couleurs d'appoint seulement, chacune avec un sens unique :

| Token      | Hex       | Sens                                                                                                              |
| ---------- | --------- | ----------------------------------------------------------------------------------------------------------------- |
| urgent     | `#D42B3A` | Un seul rouge : remises (−30 %), ventes flash, compte à rebours, « Plus que 3 », date limite (fonds, texte blanc) |
| urgentText | `#C41F2E` | Le même rouge **en petit texte** (prix barré, messages d'erreur)                                                  |
| star       | `#B07A00` | **Étoiles de note uniquement** (doré foncé, lisible sur blanc)                                                    |
| success    | `#0A7655` | Paiement réussi, « Livré », candidature envoyée, vendeur vérifié                                                  |

Pas de bleu, d'orange ni de rose. « Nouveau », « Sponsorisé », « Meilleure vente » : badges **neutres** (fond en relief, texte clair).
Sur un fond rouge ou vert succès, le texte est blanc (`onAccent`, ≥ 4,9:1) ; sur le vert citron, il est toujours foncé (`onPrimary`).

## Catégories

Les 7 catégories (Livres, Applications, Immobilier, Offres d'emploi, Musique, Images, Appels d'offres) n'ont **pas de couleur propre** :
icônes au trait en gris (`textSecondary`), sur fond en relief. Seule l'icône les distingue.

## Règles

- **Un seul bouton vert citron plein** par écran ou par carte (`Button variant="primary"`).
- Boutons secondaires **en contour** (`variant="outline"` : bordure `border`, texte `textPrimary`) ; actions tertiaires en **liens texte** (`variant="ghost"`).
- Onglets et filtres actifs : contour vert citron et texte vert lisible (`primaryText`), sans fond plein.
- Mise en page aérée : marges de 16 px, 20 px entre les sections de l'accueil, cartes produit plus larges ; recherche en pastille à bord vert citron, onglets de rayons sous la recherche, bannières sombres, fil « Recommandé pour vous » en 2 colonnes.
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

## Navigation

- **Barre du bas, 5 onglets** : Accueil · Catégories · Vendre · Panier · Compte (onglet actif en vert citron, `aria-current="page"`). « Mes achats » (ex-Bibliothèque) est dans Compte.
- **En haut** : logo « di.si store » (ou Retour), CDF / USD, cloche des notifications ; dessous, **recherche permanente** sur tous les onglets (sauf les écrans qui ont leur propre recherche filtrante : Explorer, page catégorie, Vendre).
- Support client affiché dans l'application : WhatsApp **+243 824 176 729**.

### Écrans

| Écran          | Adresse                  | Contenu                                                                                                                                                                       |
| -------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accueil        | `/fr`                    | Bandeaux à la une (glisser), avantages, grille des 7 catégories + Toutes, ventes flash, coupons, un rayon par catégorie, musique à écouter, nouvelles catégories, recommandés |
| Catégories     | `/fr/categories`         | Les 7 catégories (nombre de contenus ou « Nouveau »), raccourcis Gratuits et Promotions                                                                                       |
| Page catégorie | `/fr/categories/livres`… | Recherche, filtres par type, prix, tri ; catégorie vide : « Publier une annonce » et « Voir les autres catégories »                                                           |
| Vendre         | `/fr/vendre`             | Publier (formulaire par catégorie, brouillon, aperçu), Mes annonces (statistiques, Booster, supprimer), Messages reçus (répondre)                                             |
| Compte         | `/fr/compte`             | Profil, compteurs, Mes achats, Mes activités (candidatures, offres, visites, cautions, devis), Ma playlist, contrôle parental, favoris, réglages, langue, Devenir vendeur     |

| Annonce | `/fr/annonce/…` | Immobilier, emploi ou appel d'offres : actions de la catégorie, barre d'action fixe, annonces similaires |
| Cahier des charges | `/fr/annonce/…/cahier` | Texte complet de l'appel d'offres, copiable |

Adresses des catégories : `livres`, `applications`, `immobilier`, `emplois`, `musique`, `images`, `appels-d-offres` (`lib/categories.ts`).

## Boutons par catégorie (étape 5)

| Catégorie         | Actions                                                                                                     | Options                                                                                                                                                      |
| ----------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Toutes les fiches | Favoris · Partager (WhatsApp, Facebook, copier le lien) · Signaler · Contacter le vendeur · Donner mon avis | Vendeur vérifié et ancienneté, produits ou annonces similaires, récemment consultés                                                                          |
| Livres            | Lire un extrait · Acheter maintenant · Ajouter au panier · Offrir                                           | Format (PDF, EPUB, audio), auteur, pages, langue, lecteur intégré avec reprise de lecture                                                                    |
| Applications      | Obtenir / Télécharger · Voir les captures · Acheter                                                         | Taille, version, compatibilité Android, âge conseillé, notes de mise à jour, avertissement du contrôle parental                                              |
| Immobilier        | Réserver une visite · Contacter sur WhatsApp · Payer la caution / l'acompte                                 | Type, commune et quartier, prix par mois ou par jour, chambres, meublé, photos, visite vidéo (bientôt), carte, disponibilité, alerte nouvelle annonce        |
| Offres d'emploi   | Postuler · Envoyer mon CV · Sauvegarder l'offre                                                             | Secteur, contrat, lieu ou télétravail, salaire, date limite (compte à rebours sous 3 jours), suivi de candidature, alertes emploi                            |
| Musique           | Écouter l'extrait · Acheter le titre · Acheter l'album · Ajouter à ma playlist                              | Genre, artiste, durée, mini-lecteur persistant en bas d'écran, écoute hors-ligne après achat                                                                 |
| Images            | Aperçu avec filigrane · Choisir la licence · Télécharger en HD                                              | Licence personnelle ou commerciale (×3), résolution, format, orientation, couleur dominante, collection                                                      |
| Appels d'offres   | Télécharger le cahier des charges · Soumissionner · Poser une question                                      | Secteur, organisme, budget, date limite, documents requis, dépôt en ligne, statut de la soumission ; acheteur : Publier un appel d'offres, Demander un devis |

Recherche : bouton micro (reconnaissance vocale du téléphone) et bouton scan (lecteur de codes Google, sans permission caméra) dans la barre de recherche, affichés seulement quand le téléphone les prend en charge. Un QR code di.si store ouvre la fiche ; un autre code lance une recherche.

Confirmation animée (tampon « Envoyé », « Déposé », « Réservé », « Payé », « Publié ») après candidature, offre, visite, paiement et publication.

Démo sans serveur : ces démarches sont enregistrées sur le téléphone et suivies dans Compte › Mes activités ; « Contacter » et « Poser une question » ouvrent WhatsApp vers le support (+243 824 176 729).

## Composants

Tous visibles sur la page `/design` : logo, couleurs, typographie, boutons, badges, puces, sélecteurs, champs, cartes produit, lignes de liste, retours (toast, tampon, compte à rebours, feuille modale), squelettes, barre du bas.
