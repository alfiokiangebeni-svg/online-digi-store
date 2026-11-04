/**
 * Annonces de démonstration : Immobilier, Offres d'emploi, Appels d'offres.
 * Contenu annonceur fictif (non traduit, comme le catalogue). Remplacé par Supabase en phase 2.
 */
export type ListingCategory = "realestate" | "jobs" | "tenders";
export type PropertyType = "apartment" | "house" | "office" | "hall" | "land";
export type Contract = "cdi" | "cdd" | "internship" | "freelance";
export type WorkMode = "onsite" | "remote" | "hybrid";

interface Base {
  slug: string;
  title: string;
  /** Annonceur (agence, employeur, organisme). */
  publisher: string;
  verified: boolean;
  /** Année d'arrivée de l'annonceur sur di.si store (ancienneté). */
  since: number;
  commune: string;
  postedDaysAgo: number;
  views: number;
  description: string;
}

export interface Property extends Base {
  category: "realestate";
  type: PropertyType;
  quartier: string;
  /** Prix en cents USD par `unit`. */
  priceUsdCents: number;
  unit: "month" | "day";
  bedrooms?: number;
  furnished: boolean;
  areaM2: number;
  /** null = disponible tout de suite ; sinon date ISO. */
  availableFrom: string | null;
  /** Caution demandée, en mois de loyer (0 = acompte d'une journée pour les salles). */
  depositMonths: number;
  photos: number;
}

export interface Job extends Base {
  category: "jobs";
  sector: string;
  contract: Contract;
  mode: WorkMode;
  /** Salaire mensuel en USD (fourchette), absent = « à négocier ». */
  salaryUsd?: [number, number];
  deadlineDays: number;
  requirements: string[];
}

export interface Tender extends Base {
  category: "tenders";
  reference: string;
  sector: string;
  budgetUsd: [number, number];
  deadlineDays: number;
  documents: string[];
  specs: string[];
}

export type Listing = Property | Job | Tender;

export const LISTINGS: Listing[] = [
  {
    category: "realestate",
    slug: "appartement-2-chambres-gombe",
    title: "Appartement 2 chambres, vue sur le fleuve",
    publisher: "Kin Habitat",
    verified: true,
    since: 2023,
    commune: "Gombe",
    quartier: "Boulevard du 30 Juin",
    type: "apartment",
    priceUsdCents: 85000,
    unit: "month",
    bedrooms: 2,
    furnished: true,
    areaM2: 95,
    availableFrom: null,
    depositMonths: 3,
    photos: 6,
    postedDaysAgo: 2,
    views: 1340,
    description:
      "Au 6e étage avec ascenseur, groupe électrogène et citerne. Cuisine équipée, climatisation dans les deux chambres, gardiennage 24 h/24. Parking pour une voiture.",
  },
  {
    category: "realestate",
    slug: "maison-3-chambres-ngaliema",
    title: "Maison 3 chambres avec jardin",
    publisher: "Mama Odia Immo",
    verified: true,
    since: 2024,
    commune: "Ngaliema",
    quartier: "Binza Pigeon",
    type: "house",
    priceUsdCents: 120000,
    unit: "month",
    bedrooms: 3,
    furnished: false,
    areaM2: 180,
    availableFrom: "2026-12-01",
    depositMonths: 6,
    photos: 8,
    postedDaysAgo: 5,
    views: 880,
    description:
      "Maison de plain-pied dans une parcelle clôturée. Salon double, 2 salles de bain, dépendance pour le personnel, forage. Quartier calme, proche des écoles.",
  },
  {
    category: "realestate",
    slug: "studio-meuble-lingwala",
    title: "Studio meublé pour étudiant ou jeune actif",
    publisher: "Résidence Bon Séjour",
    verified: false,
    since: 2025,
    commune: "Lingwala",
    quartier: "Rond-point Victoire",
    type: "apartment",
    priceUsdCents: 25000,
    unit: "month",
    bedrooms: 1,
    furnished: true,
    areaM2: 28,
    availableFrom: null,
    depositMonths: 2,
    photos: 4,
    postedDaysAgo: 1,
    views: 2210,
    description:
      "Studio avec coin cuisine et douche, eau et électricité incluses. Wifi partagé. À deux minutes des transports.",
  },
  {
    category: "realestate",
    slug: "bureaux-60-m2-limete",
    title: "Bureaux de 60 m² en open space",
    publisher: "Kin Habitat",
    verified: true,
    since: 2023,
    commune: "Limete",
    quartier: "1re Rue industrielle",
    type: "office",
    priceUsdCents: 70000,
    unit: "month",
    furnished: true,
    areaM2: 60,
    availableFrom: null,
    depositMonths: 3,
    photos: 5,
    postedDaysAgo: 9,
    views: 410,
    description:
      "Plateau climatisé avec 8 postes, salle de réunion et réception. Fibre disponible, groupe électrogène, parking visiteurs.",
  },
  {
    category: "realestate",
    slug: "salle-de-fete-150-places-kintambo",
    title: "Salle de fête 150 places",
    publisher: "Espace Lisanga",
    verified: true,
    since: 2024,
    commune: "Kintambo",
    quartier: "Magasin",
    type: "hall",
    priceUsdCents: 40000,
    unit: "day",
    furnished: true,
    areaM2: 220,
    availableFrom: null,
    depositMonths: 0,
    photos: 6,
    postedDaysAgo: 3,
    views: 960,
    description:
      "Mariages, anniversaires, conférences. Tables et chaises comprises, sonorisation en option, cuisine traiteur et parking de 30 places.",
  },
  {
    category: "jobs",
    slug: "comptable-confirme-gombe",
    title: "Comptable confirmé(e)",
    publisher: "Kin Logistique SARL",
    verified: true,
    since: 2024,
    commune: "Gombe",
    sector: "Finance et comptabilité",
    contract: "cdi",
    mode: "onsite",
    salaryUsd: [800, 1100],
    deadlineDays: 12,
    postedDaysAgo: 2,
    views: 3120,
    requirements: ["Bac+3 en comptabilité", "3 ans d'expérience minimum", "Maîtrise d'un logiciel comptable"],
    description:
      "Tenue de la comptabilité générale, déclarations fiscales et sociales, préparation des états financiers. Rattaché(e) au directeur administratif et financier.",
  },
  {
    category: "jobs",
    slug: "developpeur-mobile-teletravail",
    title: "Développeur·se mobile (Android)",
    publisher: "Mbote Tech",
    verified: true,
    since: 2023,
    commune: "Kinshasa",
    sector: "Informatique",
    contract: "freelance",
    mode: "remote",
    salaryUsd: [1200, 2000],
    deadlineDays: 20,
    postedDaysAgo: 4,
    views: 1870,
    requirements: ["Kotlin ou Java", "Une application publiée", "Connexion internet stable"],
    description:
      "Mission de 6 mois renouvelable pour une application de paiement Mobile Money. Travail à distance, points d'équipe deux fois par semaine.",
  },
  {
    category: "jobs",
    slug: "enseignant-mathematiques-lemba",
    title: "Enseignant·e de mathématiques (secondaire)",
    publisher: "École Les Rameaux",
    verified: false,
    since: 2025,
    commune: "Lemba",
    sector: "Éducation",
    contract: "cdd",
    mode: "onsite",
    salaryUsd: [450, 600],
    deadlineDays: 2,
    postedDaysAgo: 10,
    views: 940,
    requirements: ["Licence en mathématiques", "Expérience en classe", "Disponible dès janvier"],
    description: "Cours de mathématiques pour les classes de 3e à 6e secondaire, 20 heures par semaine.",
  },
  {
    category: "jobs",
    slug: "stage-community-manager",
    title: "Stage : community manager",
    publisher: "Agence Lisolo",
    verified: true,
    since: 2024,
    commune: "Bandalungwa",
    sector: "Communication",
    contract: "internship",
    mode: "hybrid",
    deadlineDays: 7,
    postedDaysAgo: 1,
    views: 2560,
    requirements: ["Étudiant·e en communication ou marketing", "À l'aise sur Facebook, TikTok et WhatsApp"],
    description:
      "Stage de 3 mois : calendrier éditorial, création de visuels, réponses aux messages des clients.",
  },
  {
    category: "tenders",
    slug: "fourniture-kits-solaires-ecoles",
    title: "Fourniture et pose de kits solaires pour 12 écoles",
    publisher: "Fondation Mbote Éducation",
    verified: true,
    since: 2023,
    commune: "Kinshasa",
    reference: "AO-2026-014",
    sector: "Énergie",
    budgetUsd: [45000, 60000],
    deadlineDays: 18,
    postedDaysAgo: 6,
    views: 780,
    documents: [
      "Registre de commerce (RCCM)",
      "Attestation fiscale à jour",
      "Références de 3 chantiers similaires",
      "Offre technique et financière",
    ],
    specs: [
      "12 écoles primaires à Kinshasa (Kimbanseke, Masina, N'djili).",
      "Par école : 2 kW de panneaux, batteries lithium 5 kWh, onduleur, éclairage de 6 salles.",
      "Garantie de 2 ans pièces et main-d'œuvre, formation d'un responsable par école.",
      "Délai d'exécution : 90 jours après la commande.",
    ],
    description:
      "La fondation lance un appel d'offres ouvert pour équiper 12 écoles d'une installation solaire autonome (éclairage et recharge).",
  },
  {
    category: "tenders",
    slug: "nettoyage-bureaux-gombe",
    title: "Nettoyage quotidien de bureaux (contrat d'un an)",
    publisher: "Kin Logistique SARL",
    verified: true,
    since: 2024,
    commune: "Gombe",
    reference: "KL-NET-2026",
    sector: "Services",
    budgetUsd: [9000, 14000],
    deadlineDays: 4,
    postedDaysAgo: 8,
    views: 450,
    documents: ["RCCM", "Liste du personnel affecté", "Prix mensuel détaillé"],
    specs: [
      "Surface : 1 200 m² sur 3 niveaux.",
      "Passage du lundi au samedi, de 6 h à 8 h.",
      "Produits et matériel fournis par le prestataire.",
    ],
    description: "Recherche d'une entreprise de nettoyage pour le siège administratif, contrat de 12 mois.",
  },
  {
    category: "tenders",
    slug: "site-web-et-application-mutuelle",
    title: "Site web et application mobile pour une mutuelle de santé",
    publisher: "Mutuelle Bolamu",
    verified: false,
    since: 2025,
    commune: "Kinshasa",
    reference: "MB-NUM-03",
    sector: "Informatique",
    budgetUsd: [15000, 25000],
    deadlineDays: 25,
    postedDaysAgo: 3,
    views: 620,
    documents: ["Présentation de l'entreprise", "Portfolio (3 projets)", "Planning et devis"],
    specs: [
      "Site vitrine en français et en lingala.",
      "Application Android : carte de membre, cotisations par Mobile Money, liste des centres de santé.",
      "Hébergement et maintenance pendant 12 mois.",
    ],
    description:
      "La mutuelle souhaite moderniser l'adhésion et le paiement des cotisations de ses 8 000 membres.",
  },
];

const BY_SLUG = new Map(LISTINGS.map((l) => [l.slug, l]));
export const getListing = (slug: string) => BY_SLUG.get(slug);

export function listingsIn<C extends ListingCategory>(category: C): Extract<Listing, { category: C }>[] {
  return LISTINGS.filter((l): l is Extract<Listing, { category: C }> => l.category === category);
}

export const isListingCategory = (id: string): id is ListingCategory =>
  id === "realestate" || id === "jobs" || id === "tenders";

/** Nombre de jours restants affiché « Clôture dans x j » ; urgent sous 3 jours. */
export const URGENT_DAYS = 3;
