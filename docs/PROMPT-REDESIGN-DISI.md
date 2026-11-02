# Instruction pour Claude Code — Refonte design « di.si store »

> Copier tout ce qui suit dans Claude Code, ouvert sur le projet de l'application déjà lancée (APK).

---

## Contexte et limites de la mission

L'application est déjà construite et l'APK a déjà été généré. **Ne réécris pas le projet et ne change pas de technologie.** Ta mission tient en trois points :

1. **Refaire le design** de toute l'application avec la nouvelle identité « di.si store » (section 2).
2. **Rendre opérationnels tous les boutons et options qui ne fonctionnent pas** (section 4).
3. **Ajouter les boutons et options manquants** pour chaque type de produit en ligne (section 5).

Tu gardes la main sur la logique et le nommage des boutons existants : c'est toi qui les as créés. Tu peux les renommer, les déplacer ou les regrouper si cela améliore l'expérience, mais explique chaque changement.

Commence par :
- explorer le projet (structure, stack, navigation, écrans existants) ;
- me rendre un **état des lieux** : liste des écrans, liste de tous les boutons et options avec leur statut (fonctionne / ne fonctionne pas / partiel) et la cause probable ;
- me proposer le plan de travail, puis attendre ma validation.

---

## 1. Nom et positionnement

- Nom : **di.si store** (toujours en minuscules, avec le point).
- Plateforme multi-catégories, mobile d'abord, pour la RDC et l'Afrique centrale.
- Catégories :
  - **Livres** (ebooks, livres audio)
  - **Applications** (dont applications pour enfants)
  - **Immobilier** : location d'appartements, de maisons et d'espaces (bureaux, salles, terrains)
  - **Offres d'emploi**
  - **Musique**
  - **Images** (photos, illustrations, visuels)
  - **Appels d'offres**
- Paiement Mobile Money (M-Pesa, Airtel Money, Orange Money, Afrimoney) et carte, prix en CDF / USD : à conserver tel que déjà implémenté.

---

## 2. Nouvelle identité visuelle

### Inspiration : reprendre les bons réflexes UX, pas l'apparence

Mélange les **schémas d'ergonomie** qui ont fait leurs preuves dans les applications mobiles d'Amazon et d'Alibaba, **sans copier leurs logos, couleurs, images ni textes** : di.si store garde sa propre identité.

À reprendre côté **Amazon mobile** :
- barre de recherche collée en haut, toujours visible, avec recherche vocale et scan ;
- double action sur la fiche produit : **« Acheter maintenant »** + **« Ajouter au panier »** ;
- notes en étoiles et nombre d'avis visibles partout ;
- rayons « Les clients ont aussi acheté », « Récemment consultés », « Inspiré de vos recherches » ;
- fiche produit très lisible : prix gros, infos clés en puces, livraison ou délai clairement affichés.

À reprendre côté **Alibaba (application)** :
- grille dense d'icônes de catégories sur l'accueil ;
- bannières promotionnelles horizontales qui défilent ;
- **ventes flash avec compte à rebours** ;
- badges **« Vendeur vérifié »** et ancienneté du vendeur ;
- boutons **« Contacter le vendeur »** et **« Demander un devis »**, qui servent aussi de modèle pour les appels d'offres ;
- onglets de filtres horizontaux défilants sous la recherche.

### Palette

| Rôle | Nom | Hex | Usage |
| --- | --- | --- | --- |
| Couleur principale | Vert citron | `#B6F23A` | Boutons d'action principaux (Acheter, Payer, Postuler, Soumissionner), éléments actifs de la navigation, liens importants |
| Principale au survol / pressée | Citron profond | `#9BD61F` | États pressé et survol |
| Fond | Gris sombre | `#1C1F1E` | Fond général de l'application |
| Surface | Gris carte | `#262A28` | Cartes, feuilles modales, barre du bas |
| Surface haute | Gris relief | `#323735` | Champs de saisie, puces, éléments en relief |
| Bordure | Gris trait | `#3E4441` | Séparateurs, contours |
| Texte principal | Blanc cassé | `#F2F5F3` | Titres et textes |
| Texte secondaire | Gris clair | `#A3ACA7` | Descriptions, métadonnées |
| Texte sur vert citron | Noir encre | `#0E100F` | Texte des boutons verts (jamais de blanc sur le vert citron) |

**Couleurs marketing** (à utiliser avec parcimonie, chacune a un sens précis) :

| Rôle | Nom | Hex | Usage |
| --- | --- | --- | --- |
| Promo | Orange flash | `#FF7A1A` | Ventes flash, compte à rebours, pourcentage de réduction |
| Urgence | Rouge corail | `#FF4D5E` | Prix barré, « Plus que 3 », date limite proche, erreurs |
| Confiance | Bleu ciel | `#3BA9FF` | Vendeur vérifié, nouveautés, informations |
| Premium | Or | `#FFC53D` | Annonces sponsorisées, produits premium, meilleures ventes, étoiles |
| Succès | Vert menthe | `#2ED3A0` | Paiement réussi, « Livré », candidature envoyée |

**Couleur de repère par catégorie** (icône, bandeau fin et puce de catégorie uniquement, jamais sur les boutons d'achat) :

| Catégorie | Hex |
| --- | --- |
| Livres | `#FFB547` |
| Applications | `#3BA9FF` |
| Immobilier | `#2ED3A0` |
| Emploi | `#8F9BFF` |
| Musique | `#FF5FA2` |
| Images | `#FF8A5B` |
| Appels d'offres | `#FFC53D` |

**Règles** :
- Le vert citron reste réservé aux actions principales : un seul bouton vert plein par écran ou par carte.
- Les boutons secondaires sont en contour (bordure gris trait, texte blanc cassé) ; les actions tertiaires sont des liens texte.
- Vérifie que tous les contrastes atteignent au minimum le niveau AA.
- Mets tous ces codes dans un fichier unique de **tokens** (thème) ; aucune couleur écrite en dur dans les écrans.

### Typographie et formes

- Titres : une police grotesque affirmée (par exemple Plus Jakarta Sans ou Bricolage Grotesque, en gras).
- Texte : une police très lisible sur petits écrans (par exemple Work Sans ou DM Sans).
- Prix : chiffres tabulaires, en gras, taille nettement supérieure au texte.
- Coins arrondis modérés (8 à 12 px), ombres très légères ou aucune ; la profondeur vient des niveaux de gris.
- Icônes : une seule famille d'icônes au trait, cohérente ; pas d'emoji comme icônes.
- À éviter : dégradés violet-bleu, effet verre flou, mises en page génériques « template IA ».

### Mouvement

- Retour visuel immédiat sur chaque pression (état pressé + légère vibration haptique sur les actions d'achat).
- Squelettes de chargement à la place des écrans vides ou des indicateurs qui tournent indéfiniment.
- Animation de confirmation après paiement, candidature ou soumission.
- Respecter le réglage « réduire les animations » du téléphone.

---

## 3. Structure de navigation

- **Barre du bas (5 onglets)** : Accueil · Catégories · Vendre / Publier · Panier · Compte.
- **En haut** : logo « di.si store », recherche permanente, sélecteur CDF / USD, notifications.
- **Accueil** : bannières défilantes → grille d'icônes des 7 catégories → ventes flash avec compte à rebours → un rayon par catégorie (« Appartements à Kinshasa », « Nouvelles offres d'emploi », « Appels d'offres ouverts », « Top musique », etc.) → recommandations.
- Chaque catégorie a sa page avec filtres adaptés (section 5).

---

## 4. Rendre opérationnels tous les boutons et options

1. Dresse l'inventaire exhaustif de chaque bouton, lien, onglet, interrupteur, filtre et menu de l'application.
2. Pour chaque élément qui ne fonctionne pas ou partiellement : trouve la cause (gestionnaire absent, route inexistante, appel API en erreur, état non mis à jour, permission manquante, etc.) et corrige-la.
3. Aucun bouton ne doit rester sans action. Si une fonctionnalité n'est pas encore prête, le bouton est masqué ou affiche clairement « Bientôt disponible », jamais un clic sans effet.
4. Chaque action affiche un retour : chargement, succès ou message d'erreur clair en français, avec possibilité de réessayer.
5. Gère les cas hors-ligne et réseau lent : message explicite et nouvelle tentative possible.
6. Écris un **test automatisé pour chaque bouton important** (parcours d'achat, panier, paiement, publication, postuler, soumissionner, contacter, favoris, partage, filtres).
7. Livre un tableau final « Bouton → écran → statut avant → correction apportée → test associé ».

---

## 5. Boutons et options à ajouter par type de produit

Communs à toutes les fiches : **Favoris**, **Partager** (WhatsApp, Facebook, lien copié), **Signaler**, **Contacter le vendeur**, avis et notes, badge Vendeur vérifié, produits similaires.

| Catégorie | Actions principales | Options et filtres |
| --- | --- | --- |
| Livres | Lire un extrait · Acheter maintenant · Ajouter au panier · Offrir | Format (PDF, EPUB, audio), langue, auteur, nombre de pages, lecteur intégré, reprise de lecture |
| Applications | Installer / Télécharger · Voir les captures · Acheter | Taille, version, compatibilité Android, âge conseillé, notes de mise à jour, contrôle parental pour les apps enfants |
| Immobilier | Réserver une visite · Contacter sur WhatsApp · Payer la caution / l'acompte | Type (appartement, maison, espace), commune et quartier, prix par mois, nombre de chambres, meublé ou non, galerie photos et vidéo, carte, disponibilité, alerte nouvelle annonce |
| Offres d'emploi | Postuler · Envoyer mon CV · Sauvegarder l'offre | Secteur, type de contrat, lieu ou télétravail, salaire, date limite avec compte à rebours, suivi de candidature, alertes emploi |
| Musique | Écouter l'extrait · Acheter le titre · Acheter l'album · Ajouter à ma playlist | Genre, artiste, durée, lecteur avec mini-lecteur persistant en bas d'écran, téléchargement hors-ligne après achat |
| Images | Aperçu avec filigrane · Choisir la licence · Télécharger en HD | Licence personnelle ou commerciale, résolution, format, orientation, couleur dominante, collections |
| Appels d'offres | Télécharger le cahier des charges · Soumissionner · Poser une question | Secteur, organisme, budget estimé, date limite avec compte à rebours, documents requis, dépôt de l'offre en ligne, statut de la soumission, côté acheteur : **« Publier un appel d'offres »** et **« Demander un devis »** |

Côté **vendeurs / annonceurs** (onglet « Vendre / Publier ») : formulaire de publication adapté à chaque catégorie, brouillon, aperçu avant publication, statistiques (vues, contacts, ventes), mise en avant payante (« Booster mon annonce »), gestion des messages et des candidatures ou soumissions reçues.

---

## 6. Performance (à ne pas dégrader)

- L'application doit rester fluide sur un Android d'entrée de gamme en 3G/4G.
- Images compressées et redimensionnées, chargement progressif des listes (pagination ou défilement infini), mise en cache des écrans déjà visités.
- Aucune nouvelle dépendance lourde sans justification.
- Mesure le temps de démarrage et la taille de l'APK **avant et après** la refonte, et donne-moi les deux chiffres. La taille ne doit pas augmenter de plus de 10 %.

---

## 7. Livraison

Travaille par étapes et montre-moi le résultat à chaque étape avant de continuer :

1. État des lieux (écrans, boutons, bugs) et plan.
2. Thème : fichier de tokens, typographie, composants de base (boutons, cartes produit, badges, puces, champs, barre du bas, squelettes). Fournis des captures d'écran.
3. Correction de tous les boutons et options défaillants, avec tests.
4. Refonte des écrans existants avec le nouveau thème.
5. Ajout des nouveaux boutons et options par catégorie.
6. Génération d'un nouvel APK de test, avec captures d'écran de chaque écran principal et tableau récapitulatif des boutons.

Règles :
- Commits petits et clairs en français (`design: …`, `fix: …`, `feat: …`).
- Mets à jour `docs/DESIGN.md` avec la nouvelle charte « di.si store », qui remplace l'ancienne palette.
- Si une décision change le périmètre, le coût ou une fonctionnalité existante, pose-moi la question avant d'agir.
- Support client à afficher dans l'application : WhatsApp **+243 824 176 729**.
