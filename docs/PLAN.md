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
