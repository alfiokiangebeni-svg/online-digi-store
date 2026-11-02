# Plan de réalisation

Suit `docs/PROMPT-CLAUDE-CODE.md` §9. Une Pull Request par phase.

| Phase                                               | Contenu                                                                                        | État       |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------- |
| 1. Fondations                                       | Next.js, Tailwind + tokens, polices, design system, page `/design`, i18n, PWA, CI avec budgets | **Livrée** |
| 2. Données                                          | Schéma Supabase, RLS, seeds (20 produits)                                                      | À faire    |
| 3. Portail Acheteurs                                | Découverte, recherche, page produit, bibliothèque                                              | À faire    |
| 4. Paiement                                         | `PaymentProvider`, adaptateur mock, flux complet, livraison, notifications                     | À faire    |
| 5. Portail Vendeurs                                 | KYC, produits, ventes, portefeuille, retraits, marketing                                       | À faire    |
| 6. Administration                                   | Paramètres, modération, flags, rapprochement, audit                                            | À faire    |
| 7. Enfants, affiliation, cartes cadeaux, abonnement |                                                                                                | À faire    |
| 8. Durcissement                                     | E2E Playwright, audit sécurité (CSP à nonces), optimisation finale                             | À faire    |

## Décisions prises

| Sujet                     | Décision                                                                                   | Raison                                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Compilateur de production | `next build --webpack`                                                                     | 112 Ko de JS (brotli) sur l'accueil contre ≈ 120 Ko avec Turbopack. Le développement reste sur Turbopack.                            |
| Mesure du budget JS       | Taille **brotli** (gzip affiché aussi)                                                     | C'est ce que Cloudflare / Vercel envoient à Chrome Android. En gzip : 135 Ko. Le socle React + Next pèse à lui seul ≈ 105 Ko brotli. |
| CSS                       | Intégré au HTML (`experimental.inlineCss`)                                                 | Supprime une requête bloquante (≈ 6 Ko) : − 0,5 s de LCP simulé en Slow 4G.                                                          |
| Polices                   | Fichiers locaux figés et réduits (`scripts/build-fonts.py`)                                | Google sert des polices variables complètes : 71 Ko préchargés → 18,7 Ko.                                                            |
| Police des titres         | `font-display: optional`                                                                   | Le titre (élément LCP) n'est pas redessiné en 3G ; la police est en cache dès la 2ᵉ visite.                                          |
| i18n                      | Dictionnaires JSON maison, URL `/fr`, `/ln`, `/en` ; `/` sert le français sans redirection | Zéro JS client, pages 100 % statiques. Un test vérifie que les 3 langues ont les mêmes clés et variables.                            |
| Lingala                   | Premier jet, **à faire relire par un locuteur natif** (`_meta.status`)                     |                                                                                                                                      |
| PWA                       | Service worker écrit à la main (`public/sw.js`, ≈ 3 Ko)                                    | Les plugins PWA dépendent de webpack/Turbopack et ajoutent du poids.                                                                 |
| Recherche (phase 3)       | Postgres `pg_trgm` + plein texte                                                           | Aucun coût supplémentaire ; Meilisearch possible plus tard.                                                                          |
| Branche                   | `ccr-ce3f7f40-d0g17w` (imposée par l'environnement) au lieu de `feat/<sujet>`              |                                                                                                                                      |

## Phase 1 — mesures

Lighthouse 12.6 (mobile, Slow 4G simulé, CPU ×4), médiane de 5 passages, build de production :

| Page         | Perf. | Access. | Bonnes pratiques | LCP    | TBT   | CLS | Poids  |
| ------------ | ----- | ------- | ---------------- | ------ | ----- | --- | ------ |
| Accueil `/`  | 99    | 100     | 100              | 1,73 s | 73 ms | 0   | 254 Ko |
| `/fr/design` | 98    | 100     | 100              | 2,11 s | 67 ms | 0   | 271 Ko |

Budget (`npm run budget`) : accueil 112,3 Ko de JS brotli (max 120), 146 Ko pour la première visite (max 1 Mo ; 400 Ko en données légères).

Pages produit et paiement : ajoutées à Lighthouse CI dès qu'elles existent (phases 3 et 4).

## Intégration de la maquette mobile (« Soko »)

Écrans livrés : accueil, explorer, fiche produit (`/produit/[slug]`, 16 produits × 3 langues générés statiquement), panier + paiement, bibliothèque, compte. Les anciennes routes `/recherche` et `/moi` redirigent vers `/explorer` et `/compte`.

Options ajoutées par rapport à la maquette :

| Option                                    | Détail                                                                                                                                                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bascule $ / FC partout                    | Les deux prix sont rendus, le CSS affiche la devise choisie : aucun JavaScript, aucun clignotement                                                                                                      |
| Paiement simulé de bout en bout           | Code parental → demande envoyée → « Regarde ton téléphone » + délai de 2 min → tampon LIVRÉ ; numéro finissant par 1 / 2 / 3 = PIN refusé / solde insuffisant / pas de réponse (`lib/payments/mock.ts`) |
| Offrir à un numéro                        | Depuis la fiche produit ; le cadeau part au destinataire, pas dans ta bibliothèque                                                                                                                      |
| Partage WhatsApp                          | Lien `wa.me` pré-rempli sur chaque fiche                                                                                                                                                                |
| Contrôle parental avec PIN                | Filtre l'explorer par âge, PIN exigé avant paiement                                                                                                                                                     |
| Recherche tolérante aux fautes            | « kinshassa », « emploie » trouvent le bon livre (`lib/search.ts`)                                                                                                                                      |
| Extraits audio                            | Bouton lecture sur la musique ; mélodie synthétisée tant que les vrais extraits (R2) n'existent pas                                                                                                     |
| Offres du vendredi                        | Compte à rebours jusqu'au vendredi 23 h 59, heure de Kinshasa                                                                                                                                           |
| Favoris, panier, bibliothèque persistants | Stockés sur le téléphone (localStorage) en attendant les comptes Supabase                                                                                                                               |
| Codes promo                               | `KIN2026` (−20 %), `ENFANT1` (−1 $) — démonstration                                                                                                                                                     |

Lighthouse (médiane de 5 passages, mobile Slow 4G simulé, CPU ×4) :

| Page          | Perf. | Access. | LCP     | TBT      | CLS   |
| ------------- | ----- | ------- | ------- | -------- | ----- |
| Accueil       | 96–97 | 100     | ≈ 2,0 s | ≈ 150 ms | 0,002 |
| Fiche produit | 95    | 100     | ≈ 2,6 s | ≈ 150 ms | 0,004 |
| Panier        | 98    | 100     | ≈ 2,0 s | ≈ 140 ms | 0     |

**Écart au budget** : le score (≥ 95) et le CLS tiennent ; le LCP simulé dépasse 2,0 s sur la fiche produit (et frôle la limite sur l'accueil). En mesure réelle sans bridage, le titre (élément LCP) s'affiche au premier rendu (≈ 140 ms) ; l'écart vient du modèle de Lighthouse, qui compte tout le JavaScript demandé avant ce rendu. Pistes : charger à la demande la feuille « Offrir » et le compte à rebours, passer les fiches en rendu sans hydratation hors barre d'achat.

JavaScript (brotli) : accueil 115 Ko (budget 120), fiche produit 118 Ko, panier 122 Ko.

## Design de la maquette appliqué (remplace « Kinshasa la nuit »)

À la demande du propriétaire, l'application adopte le style visuel complet de la maquette mobile : fond citron `#E8F5C0`, cartes blanches arrondies, Inter, boutons noirs, liens verts, remises rouges, bandeaux noirs à accent citron, barre de navigation blanche. Détails dans `docs/DESIGN.md`.

- Police : Inter variable 400–700 en un seul fichier de 28 Ko (au lieu de trois familles) ; elle contient ɛ et ɔ pour le lingala.
- Mode clair par défaut ; mode sombre en réglage (Compte).
- Icônes d'application régénérées (« d. » citron sur noir).
- Deux couleurs foncées par rapport à la maquette pour le contraste AA (prix barré, liens sur fond citron).

Lighthouse (médiane de 5 passages, mobile Slow 4G simulé, CPU ×4) — **toutes les assertions de la CI passent** :

| Page          | Perf. | Access. | LCP (min–max)             | TBT       | CLS |
| ------------- | ----- | ------- | ------------------------- | --------- | --- |
| Accueil       | 96–99 | 100     | 1,7–2,3 s                 | 80–170 ms | 0   |
| Fiche produit | 98–99 | 100     | 1,1–2,2 s (médiane 1,9 s) | 70–140 ms | 0   |
| Panier        | 97–99 | 100     | 1,3–1,8 s                 | 95–180 ms | 0   |

JavaScript (brotli) : accueil 115 Ko, fiche produit 117 Ko, panier 121 Ko. Police : 28 Ko.
