# Instruction pour Claude Code — Digi Store

> Copier tout ce qui suit dans Claude Code, à la racine du dépôt `online-digi-store`.

---

## Rôle et mission

Tu es lead développeur full-stack et designer produit. Construis **Digi Store**, une plateforme de vente de produits digitaux pour la RDC : livres numériques de l'auteur, applications et contenus pour enfants, formations, templates, musique, cartes cadeaux. Trois portails : **Acheteurs**, **Vendeurs**, **Administration**.

Avant d'écrire du code, lis entièrement :
- `README.md` (périmètre, stack, règles de sécurité)
- `docs/DESIGN.md` (charte « Kinshasa la nuit » — obligatoire)
- `docs/PAIEMENT-MOBILE-MONEY.md` (flux de paiement)
- `docs/ROADMAP.md`

Puis propose-moi un plan par phases (voir fin du document) et attends ma validation avant la phase 1.

---

## 1. Performance — priorité absolue

Les clients sont sur mobile Android d'entrée de gamme, en 3G ou 4G instable, avec peu de forfait. **Une fonctionnalité qui casse ces budgets n'est pas livrée.**

### Budgets (mesurés en Lighthouse mobile, réseau « Slow 4G », CPU ×4)

| Mesure | Cible |
| --- | --- |
| Score Lighthouse Performance | ≥ 95 sur accueil, page produit, paiement |
| LCP | < 2,0 s |
| INP | < 150 ms |
| CLS | < 0,05 |
| JavaScript envoyé (page d'accueil) | < 120 Ko compressé |
| Poids total première visite | < 1 Mo (< 400 Ko en mode « données légères ») |
| Temps de réponse API (p95) | < 300 ms |

### Règles techniques
- Next.js App Router, **React Server Components par défaut** ; `"use client"` uniquement quand c'est indispensable (bouton payer, lecteur d'aperçu, formulaires).
- Pages catalogue et produit en rendu statique + revalidation (ISR / `revalidateTag`) ; jamais de rendu dynamique sans raison.
- Images : `next/image`, AVIF/WebP, tailles responsives, `priority` uniquement sur l'image LCP, placeholders flous légers.
- Polices : `next/font` auto-hébergées, sous-ensemble latin, `display: swap`, maximum 3 familles (voir DESIGN.md).
- Aucune librairie lourde côté client (pas de moment, lodash complet, librairies d'animation lourdes). Animations en CSS.
- Chargement différé (`dynamic()`) pour : lecteur vidéo/audio, éditeur vendeur, graphiques du tableau de bord.
- Fichiers et aperçus servis par CDN (Cloudflare R2 + cache) ; liens signés.
- Requêtes base de données : index sur toutes les colonnes filtrées/triées, pagination par curseur, pas de N+1.
- PWA : service worker avec cache de l'interface et de la bibliothèque, fonctionnement hors-ligne pour les contenus achetés.
- **Mode données légères** (réglage utilisateur + détection `navigator.connection.saveData`) : images basse résolution, pas d'autoplay, pas de vidéo d'aperçu automatique.
- Ajoute un **budget CI** : le build échoue si le JS dépasse les budgets (`size-limit` ou équivalent) et un test Lighthouse CI tourne sur chaque PR.

---

## 2. Design — percutant, jamais « template IA »

Applique `docs/DESIGN.md` à la lettre :
- Palette : Encre de nuit `#14110F`, Papier pagne `#F4EEE3`, **Jaune taxi `#F2B705` uniquement sur les éléments de vente**, Latérite `#C2502E`, Vert fleuve `#1F6F5C`, Cendre `#8C8279`.
- Polices : Bricolage Grotesque (titres), Work Sans (texte), Space Mono (prix et codes).
- Signatures : cartes produit en **ticket à coin coupé** avec perforation, séparateurs en motifs Kuba (SVG léger, opacité 10–15 %), photos en bichromie, grain papier en mode clair, tampon « LIVRÉ » animé.
- Interdits : dégradés violet-bleu, glassmorphism, Inter, emoji en icônes, cartes génériques arrondies, textes creux.
- Mode sombre par défaut, mode clair disponible.
- Rayon « Enfants » : même charte mais formes plus rondes et illustrations plus grandes, contrôle parental (voir 3.6).

Crée d'abord un **design system** dans `components/ui/` (tokens Tailwind, Bouton, Ticket produit, Badge, Puce, Champ, Feuille modale, Barre de navigation, Toast, Skeleton) et une page `/design` qui les montre tous. Chaque écran est construit uniquement avec ces composants.

Accessibilité : contraste AA minimum, cibles tactiles ≥ 44 px, navigation clavier, libellés ARIA, respect de `prefers-reduced-motion`.

Langues : français par défaut, **lingala** et **anglais** prévus via i18n (fichiers de traduction, aucun texte en dur).

---

## 3. Portail Acheteurs — full option

### 3.1 Découverte
- Accueil : Drops du jour (format stories), rayons Tendance à Kinshasa, Moins de 5 $, Livres de l'auteur, Enfants, Créateurs congolais, Revenez le finir (paniers abandonnés), Recommandé pour vous.
- Recherche instantanée avec suggestions, tolérance aux fautes, filtres (catégorie, prix, langue, format, note, vendeur), tri.
- Pages catégorie et page vendeur (boutique publique).

### 3.2 Page produit
- Aperçu gratuit obligatoire : extrait PDF/EPUB en lecture, 30 s audio, 1 min vidéo, captures pour les apps enfants.
- Prix en CDF / USD avec bascule, prix barré si promo, compteur de vente flash.
- Avis avec photo, note moyenne, nombre de ventes, badge Vendeur vérifié.
- Produits liés, packs, « Offrir ce produit ».
- Bouton fixe « Payer avec Mobile Money ».

### 3.3 Panier et paiement
- Achat en un clic (sans panier) ou panier multi-produits.
- Achat sans compte : compte créé à partir du numéro de téléphone + code OTP par SMS/WhatsApp.
- Saisie du numéro → détection de l'opérateur par préfixe → demande de paiement envoyée → écran d'attente → tampon « LIVRÉ ».
- Codes promo, cartes cadeaux, solde de parrainage, paiement en 2 fois (V3, derrière un flag).
- Carte bancaire pour la diaspora.
- Gestion de tous les cas d'échec listés dans `docs/PAIEMENT-MOBILE-MONEY.md`.

### 3.4 Bibliothèque
- Tous les achats, re-téléchargement illimité via liens signés, lecteur intégré PDF/EPUB, audio et vidéo, reprise de lecture, hors-ligne.
- Factures téléchargeables.

### 3.5 Compte
- Profil, numéros Mobile Money enregistrés, devise et langue préférées, mode données légères, notifications (WhatsApp, SMS, e-mail), liste de souhaits, historique, lien d'affiliation et gains, appareils connectés (limite 5), suppression du compte et export des données.

### 3.6 Espace Enfants
- Profils enfants rattachés au compte parent, contrôle parental par code PIN, achats validés uniquement par le parent, aucun lien externe ni publicité dans les profils enfants.

### 3.7 Support
- Bouton WhatsApp `+243 824 176 729`, FAQ, demande de remboursement depuis la commande, suivi des tickets.

---

## 4. Portail Vendeurs — full option

### 4.1 Inscription et vérification
- Inscription, vérification KYC (pièce d'identité, numéro Mobile Money de reversement, RCCM optionnel pour les entreprises), statut de validation.

### 4.2 Produits
- Création et édition : titre, description riche, catégories, tags, langue, prix USD (CDF calculé), prix promo et période, fichiers (upload direct vers R2, reprise en cas de coupure), aperçu, couverture, version et notes de mise à jour, licence (usage personnel / commercial), limite de téléchargements, filigrane activé.
- Types : livre/ebook, formation (modules + leçons + vidéos), application enfants, audio, template, carte cadeau, abonnement.
- Brouillon, programmé, publié, archivé ; import en masse par CSV.
- Packs et ventes croisées.

### 4.3 Ventes et finances
- Tableau de bord : chiffre d'affaires du jour/semaine/mois, commandes, taux de conversion, produits les plus vus, panier moyen, sources de trafic.
- Liste des commandes, détails acheteur (sans données sensibles), remboursements.
- Portefeuille vendeur : solde disponible, solde en attente, commission plateforme détaillée, **demande de retrait vers Mobile Money**, historique des reversements, relevés exportables.

### 4.4 Marketing
- Codes promo, ventes flash, liens d'affiliation propres au vendeur avec taux de commission réglable, emplacements sponsorisés payants (publicité interne), statistiques de chaque campagne, partage en un clic vers WhatsApp/Facebook/TikTok.

### 4.5 Boutique et relation client
- Page boutique personnalisable (bannière, bio, liens), réponse aux avis, messagerie avec acheteurs (modérée), notifications de vente en temps réel.

### 4.6 Équipe
- Plusieurs membres par boutique avec rôles (propriétaire, éditeur, comptable).

---

## 5. Portail Administration — tous les paramètres

- **Paramètres généraux** : nom, logo, couleurs (tokens), langues actives, devises, taux USD→CDF (automatique + forçage manuel), arrondi.
- **Paiement** : agrégateur actif et clés (via variables d'environnement, jamais en base en clair), opérateurs activés, délai d'expiration, plafonds, mode sandbox/production.
- **Commissions** : taux par défaut, par catégorie, par vendeur ; délai de mise à disposition des fonds ; montant minimum de retrait.
- **Modération** : validation des vendeurs (KYC), des produits, signalements, avis.
- **Catalogue** : catégories, mise en avant des Drops du jour et des rayons d'accueil.
- **Marketing** : codes promo globaux, ventes flash, programme d'affiliation (taux, durée du cookie), emplacements publicitaires et tarifs.
- **Notifications** : modèles WhatsApp/SMS/e-mail éditables.
- **Pages légales** : CGV, remboursement, confidentialité, éditables.
- **Feature flags** : activer/désactiver chaque option (abonnement, paiement en 2 fois, espace enfants…).
- **Rapprochement** : rapport quotidien paiements vs commandes, alertes d'écart.
- **Journal d'audit** : toute action admin enregistrée.
- **Rôles** : super-admin, modérateur, support, finance.

---

## 6. Architecture et données

- Stack : Next.js (App Router, TypeScript strict), Tailwind CSS, Supabase (Postgres + Auth + Row Level Security), Cloudflare R2, Zod pour toute validation.
- Paiement derrière une **interface unique** `PaymentProvider` (`initiate`, `verify`, `handleWebhook`, `payout`) avec un adaptateur par agrégateur (FlexPay, CinetPay, pawaPay, MaxiCash, et d'autres comme PayWay si disponibles) + un adaptateur `mock` pour le développement.
- Tables minimales : users, profiles, child_profiles, sellers, seller_members, products, product_files, product_previews, categories, orders, order_items, payments, payouts, wallets, ledger_entries (comptabilité en double entrée), coupons, affiliates, reviews, reports, notifications, settings, feature_flags, audit_logs.
- RLS activée sur toutes les tables ; un acheteur ne voit que ses commandes, un vendeur que ses produits et ventes.
- Tâches planifiées : taux de change quotidien, rapprochement nocturne, expiration des commandes en attente, libération des fonds vendeurs.

---

## 7. Sécurité (non négociable)

- Livraison uniquement après webhook signé **et** re-vérification du statut chez l'agrégateur ; webhooks idempotents.
- Liens de téléchargement signés, expiration 24 h ; filigrane PDF avec le numéro de l'acheteur.
- Limite de 5 appareils pour les vidéos.
- Rate limiting sur OTP, paiement, connexion.
- En-têtes de sécurité (CSP stricte, HSTS), protection CSRF, validation Zod côté serveur.
- Aucun secret dans le code ni dans le client.

---

## 8. Qualité et tests

- Tests unitaires (Vitest) : détection opérateur, conversion devise, calcul des commissions, ledger.
- Tests d'intégration du flux de paiement avec l'adaptateur `mock` : succès, échec, délai dépassé, webhook en double, signature invalide.
- Tests de bout en bout (Playwright) sur mobile émulé : achat sans compte, achat avec compte, publication vendeur, retrait vendeur.
- Lighthouse CI + `size-limit` dans GitHub Actions ; le build échoue si un budget de la section 1 est dépassé.
- ESLint + Prettier + TypeScript strict, zéro erreur.

---

## 9. Ordre de travail

Travaille par phases. À la fin de chaque phase : résume ce qui est fait, montre les scores Lighthouse, ouvre une Pull Request, et attends ma validation.

1. **Fondations** : projet Next.js, Tailwind + tokens, polices, design system et page `/design`, i18n, PWA, CI avec budgets.
2. **Données** : schéma Supabase, RLS, seeds (20 produits de démonstration dont livres et apps enfants).
3. **Portail Acheteurs** : découverte, recherche, page produit, bibliothèque.
4. **Paiement** : interface `PaymentProvider`, adaptateur mock, flux complet, livraison, notifications.
5. **Portail Vendeurs** : KYC, produits, ventes, portefeuille, retraits, marketing.
6. **Administration** : tous les paramètres, modération, flags, rapprochement, audit.
7. **Espace Enfants, affiliation, cartes cadeaux, abonnement.**
8. **Durcissement** : tests E2E complets, audit sécurité, optimisation finale des performances.

Règles de travail :
- Commits petits et clairs en français (`feat: …`, `fix: …`), branches `feat/<sujet>`, PR vers `main`.
- Ne jamais inventer de clés API : utiliser `.env.example` et l'adaptateur `mock`.
- Quand une décision change le périmètre ou le coût, pose-moi la question au lieu de supposer.
