# Digi Store

> Tu paies avec ton téléphone, tu reçois tout de suite.

Boutique en ligne de **produits digitaux** (formations, ebooks, templates, musique, logiciels, cartes cadeaux, abonnements) pensée pour la RDC et l'Afrique centrale : paiement **Mobile Money** natif, prix en **CDF ou USD**, livraison du fichier en moins de 10 secondes.

---

## Pourquoi Digi Store

| Problème des grandes plateformes en RDC | Réponse Digi Store |
| --- | --- |
| Carte bancaire obligatoire | M-Pesa, Airtel Money, Orange Money, Afrimoney |
| Prix en dollars ou euros seulement | Double affichage CDF / USD |
| Livraison lente ou incertaine | Lien de téléchargement instantané + copie WhatsApp / SMS |
| Sites lourds | Pages < 1 Mo, mode « données légères », fonctionne en 3G |
| Pas de vendeurs locaux | Marketplace : les créateurs congolais vendent et sont payés sur leur wallet |
| Achat à l'aveugle | Aperçu gratuit obligatoire (extrait PDF, 30 s audio, 1 min vidéo) |

---

## Fonctionnalités

### V1 — Lancement
- [ ] Catalogue avec rayons : Drops du jour, Tendance à Kinshasa, Moins de 5 $, Créateurs congolais
- [ ] Page produit avec aperçu gratuit et bascule CDF / USD
- [ ] Achat sans compte (compte créé automatiquement à partir du numéro)
- [ ] Paiement Mobile Money en un écran, détection automatique de l'opérateur
- [ ] Livraison instantanée + envoi du lien par WhatsApp et SMS
- [ ] Bibliothèque : re-téléchargement illimité, lecture hors-ligne
- [ ] Codes promo, ventes flash, packs
- [ ] Avis clients avec photo
- [ ] Mode données légères
- [ ] Application installable (PWA)

### V2
- [ ] Espace vendeurs (marketplace) avec reversement Mobile Money
- [ ] Programme d'affiliation (commission versée en Mobile Money)
- [ ] Cartes cadeaux envoyées par numéro de téléphone
- [ ] Abonnement mensuel

### V3
- [ ] Paiement en 2 fois
- [ ] Points fidélité
- [ ] Application Android native

---

## Stack technique

| Couche | Choix |
| --- | --- |
| Front + API | [Next.js](https://nextjs.org) (App Router, TypeScript), PWA |
| Base de données + authentification | [Supabase](https://supabase.com) (Postgres) |
| Stockage des fichiers | Cloudflare R2 (compatible S3), liens signés |
| Paiement | Agrégateur Mobile Money RDC (FlexPay, CinetPay, pawaPay ou MaxiCash — voir [docs/PAIEMENT-MOBILE-MONEY.md](docs/PAIEMENT-MOBILE-MONEY.md)) |
| Notifications | WhatsApp Business API, SMS de secours, e-mail facultatif |
| Style | Tailwind CSS + tokens de la charte ([docs/DESIGN.md](docs/DESIGN.md)) |
| Suivi | Google Analytics 4, pixels Meta et TikTok |

---

## Structure du projet

```
digi-store/
├── app/                    # Pages et routes Next.js
│   ├── (shop)/             # Découvrir, Chercher, Produit
│   ├── bibliotheque/       # Achats de l'utilisateur
│   ├── vendeur/            # Espace vendeurs (V2)
│   └── api/
│       ├── checkout/       # Création d'une demande de paiement
│       ├── webhooks/       # Confirmation de l'agrégateur
│       └── download/       # Génération des liens signés
├── components/             # Composants UI (ticket produit, bouton payer…)
├── lib/
│   ├── payments/           # Client de l'agrégateur Mobile Money
│   ├── currency/           # Conversion USD → CDF
│   ├── operators.ts        # Détection de l'opérateur par préfixe
│   └── storage/            # Accès R2, liens signés, filigrane PDF
├── supabase/migrations/    # Schéma de la base
├── public/                 # Logo, motifs Kuba, polices
└── docs/                   # Design, paiement, feuille de route
```

---

## Installation

Prérequis : Node.js 20+, un compte Supabase, un bucket R2, des clés sandbox d'un agrégateur Mobile Money.

```bash
git clone https://github.com/Alfiokiangebeni-svg/online-digi-store.git
cd online-digi-store
npm install
cp .env.example .env.local   # puis remplir les valeurs
npm run dev
```

Le site tourne sur http://localhost:3000.

---

## Règles de sécurité (non négociables)

1. **Livrer uniquement après confirmation serveur** : le fichier est débloqué par le webhook signé de l'agrégateur, jamais par le retour du navigateur.
2. **Webhooks idempotents** : une même transaction ne livre qu'une fois.
3. **Liens de téléchargement signés** qui expirent après 24 h, régénérés depuis la bibliothèque.
4. **Filigrane PDF** avec le numéro de l'acheteur.
5. **Limite de 5 appareils** par compte pour les vidéos.
6. **Aucune clé secrète dans le code** : tout passe par les variables d'environnement.

---

## Documentation

- [docs/DESIGN.md](docs/DESIGN.md) — charte « Kinshasa la nuit » : couleurs, polices, formes
- [docs/PAIEMENT-MOBILE-MONEY.md](docs/PAIEMENT-MOBILE-MONEY.md) — opérateurs, agrégateurs, flux de paiement
- [docs/ROADMAP.md](docs/ROADMAP.md) — feuille de route
- [CONTRIBUTING.md](CONTRIBUTING.md) — règles pour contribuer

---

## Contact

Support client : WhatsApp (français et lingala) — [+243 824 176 729](https://wa.me/243824176729)
