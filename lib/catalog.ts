import type { CoverTone } from "@/components/ui/Ticket";
import type { Locale } from "@/lib/i18n/config";
import type { CategoryId } from "@/lib/theme";

/**
 * Catalogue de démonstration. Remplacé par Supabase en phase 2 :
 * les écrans ne dépendent que de ce type et des fonctions ci-dessous.
 * Titres et descriptions sont du contenu vendeur (non traduit).
 */
export type Kind = "game" | "edu" | "ebook" | "course" | "image" | "music" | "template" | "giftCard";
export type Platform = "android" | "windows" | "web";
export type Rail = "trending" | "free" | "deals" | "images" | "music" | "author" | "kids" | "creators";

export interface Product {
  slug: string;
  title: string;
  seller: string;
  verified: boolean;
  kind: Kind;
  /** 0 = gratuit */
  priceUsdCents: number;
  promoUsdCents?: number;
  sales: number;
  rating: number;
  reviews: number;
  /** Tranche d'âge conseillée (contenus enfants). */
  age?: [number, number];
  platforms?: Partial<Record<Platform, number>>;
  /** Format lisible : « PDF · 180 pages », « MP3 · 12 titres »… */
  format: string;
  sizeMb: number;
  languages: Locale[];
  license: "personal" | "commercial";
  version: string;
  updatedAt: string;
  tone: CoverTone;
  isNew?: boolean;
  rails: Rail[];
  description: string;
}

export const CATALOG: Product[] = [
  {
    slug: "kinshasa-mode-emploi",
    title: "Kinshasa, mode d'emploi",
    seller: "L'auteur",
    verified: true,
    kind: "ebook",
    priceUsdCents: 699,
    promoUsdCents: 499,
    sales: 1240,
    rating: 4.8,
    reviews: 212,
    format: "EPUB + PDF · 184 pages",
    sizeMb: 6,
    languages: ["fr"],
    license: "personal",
    version: "2.0",
    updatedAt: "2026-10-12",
    tone: "laterite",
    rails: ["trending", "author", "deals"],
    description:
      "Le guide vivant de la capitale : quartiers, transports, bons plans et codes de la rue, raconté par quelqu'un qui y a grandi.",
  },
  {
    slug: "le-fleuve-et-nous",
    title: "Le fleuve et nous",
    seller: "L'auteur",
    verified: true,
    kind: "ebook",
    priceUsdCents: 899,
    sales: 402,
    rating: 4.9,
    reviews: 77,
    format: "EPUB + PDF · 240 pages",
    sizeMb: 8,
    languages: ["fr"],
    license: "personal",
    version: "1.0",
    updatedAt: "2026-10-28",
    tone: "fleuve",
    isNew: true,
    rails: ["author"],
    description: "Roman. Trois générations d'une famille de pêcheurs de Maluku, entre le fleuve et la ville.",
  },
  {
    slug: "maths-en-s-amusant",
    title: "Maths en s'amusant",
    seller: "Studio Bana",
    verified: true,
    kind: "edu",
    priceUsdCents: 299,
    promoUsdCents: 149,
    sales: 2400,
    rating: 4.6,
    reviews: 312,
    age: [5, 8],
    platforms: { android: 48, windows: 120, web: 0 },
    format: "Application · 6 niveaux",
    sizeMb: 48,
    languages: ["fr", "ln"],
    license: "personal",
    version: "2.3.1",
    updatedAt: "2026-10-28",
    tone: "fleuve",
    rails: ["deals", "kids", "trending"],
    description:
      "Additions, soustractions et premières tables en jouant au marché : l'enfant vend des mangues, rend la monnaie et gagne des étoiles. Six niveaux, sans publicité.",
  },
  {
    slug: "les-lettres-en-couleurs",
    title: "Les lettres en couleurs",
    seller: "Studio Bana",
    verified: true,
    kind: "edu",
    priceUsdCents: 0,
    sales: 5120,
    rating: 4.6,
    reviews: 640,
    age: [3, 6],
    platforms: { android: 32, web: 0 },
    format: "Application · 26 lettres",
    sizeMb: 32,
    languages: ["fr", "ln"],
    license: "personal",
    version: "1.4.0",
    updatedAt: "2026-09-02",
    tone: "laterite",
    rails: ["free", "kids"],
    description:
      "L'alphabet en sons et en couleurs, lettre par lettre, avec la voix d'une maîtresse de Kinshasa.",
  },
  {
    slug: "puzzle-des-animaux",
    title: "Puzzle des animaux",
    seller: "Okapi Games",
    verified: false,
    kind: "game",
    priceUsdCents: 0,
    sales: 3310,
    rating: 4.4,
    reviews: 288,
    age: [4, 8],
    platforms: { web: 0, android: 41 },
    format: "Jeu · 40 puzzles",
    sizeMb: 41,
    languages: ["fr", "ln", "en"],
    license: "personal",
    version: "1.1.0",
    updatedAt: "2026-08-19",
    tone: "cendre",
    rails: ["free", "kids"],
    description: "Okapi, bonobo, éléphant de forêt : quarante puzzles pour découvrir les animaux du Congo.",
  },
  {
    slug: "compter-avec-nono",
    title: "Compter avec Nono",
    seller: "L'auteur",
    verified: true,
    kind: "edu",
    priceUsdCents: 0,
    sales: 1980,
    rating: 4.7,
    reviews: 154,
    age: [4, 7],
    platforms: { android: 27, web: 0 },
    format: "Application · 1 à 100",
    sizeMb: 27,
    languages: ["fr", "ln"],
    license: "personal",
    version: "1.0.3",
    updatedAt: "2026-07-30",
    tone: "fleuve",
    rails: ["free", "kids", "author"],
    description: "Nono le perroquet apprend à compter jusqu'à 100, en français et en lingala.",
  },
  {
    slug: "course-des-petites-voitures",
    title: "Course des petites voitures",
    seller: "Okapi Games",
    verified: false,
    kind: "game",
    priceUsdCents: 299,
    promoUsdCents: 209,
    sales: 860,
    rating: 4.3,
    reviews: 96,
    age: [4, 9],
    platforms: { android: 64 },
    format: "Jeu · 12 circuits",
    sizeMb: 64,
    languages: ["fr", "en"],
    license: "personal",
    version: "1.2.0",
    updatedAt: "2026-10-05",
    tone: "laterite",
    rails: ["deals", "kids"],
    description:
      "Douze circuits à travers Kinshasa, du boulevard du 30 Juin au rond-point Victoire. Hors-ligne.",
  },
  {
    slug: "pack-20-fonds-d-ecran",
    title: "Pack 20 fonds d'écran",
    seller: "Atelier Lingwala",
    verified: true,
    kind: "image",
    priceUsdCents: 299,
    promoUsdCents: 179,
    sales: 740,
    rating: 4.8,
    reviews: 61,
    format: "JPG 4K · 20 images",
    sizeMb: 62,
    languages: ["fr"],
    license: "personal",
    version: "1.0",
    updatedAt: "2026-10-12",
    tone: "ink",
    rails: ["deals", "images", "creators"],
    description: "Vingt photographies de Kinshasa la nuit, recadrées pour téléphone et ordinateur.",
  },
  {
    slug: "coloriages-a-imprimer",
    title: "Coloriages à imprimer",
    seller: "Atelier Lingwala",
    verified: true,
    kind: "image",
    priceUsdCents: 0,
    sales: 2210,
    rating: 4.7,
    reviews: 180,
    age: [3, 10],
    format: "PDF · 30 pages",
    sizeMb: 14,
    languages: ["fr"],
    license: "personal",
    version: "1.0",
    updatedAt: "2026-09-21",
    tone: "paper",
    rails: ["free", "images", "kids"],
    description: "Trente dessins à colorier : masques, marchés, animaux et pirogues.",
  },
  {
    slug: "motifs-kuba-vectoriels",
    title: "Motifs Kuba vectoriels",
    seller: "Atelier Lingwala",
    verified: true,
    kind: "image",
    priceUsdCents: 149,
    sales: 318,
    rating: 4.6,
    reviews: 29,
    format: "SVG + PNG · 48 motifs",
    sizeMb: 22,
    languages: ["fr", "en"],
    license: "commercial",
    version: "1.1",
    updatedAt: "2026-10-01",
    tone: "cendre",
    isNew: true,
    rails: ["images", "creators"],
    description:
      "Quarante-huit motifs géométriques inspirés des velours du Kasaï, prêts pour vos affiches et tissus.",
  },
  {
    slug: "comptines-du-matin",
    title: "Comptines du matin",
    seller: "L'auteur",
    verified: true,
    kind: "music",
    priceUsdCents: 399,
    sales: 977,
    rating: 4.5,
    reviews: 102,
    age: [0, 6],
    format: "MP3 · 12 titres",
    sizeMb: 86,
    languages: ["fr", "ln"],
    license: "personal",
    version: "1.0",
    updatedAt: "2026-06-14",
    tone: "laterite",
    rails: ["music", "kids", "author", "trending"],
    description: "Douze comptines en français et en lingala pour réveiller la maison en chantant.",
  },
  {
    slug: "rumba-douce",
    title: "Rumba douce",
    seller: "Sebene Lab",
    verified: false,
    kind: "music",
    priceUsdCents: 99,
    sales: 1430,
    rating: 4.6,
    reviews: 88,
    format: "MP3 · 3 min 42",
    sizeMb: 9,
    languages: ["ln"],
    license: "personal",
    version: "1.0",
    updatedAt: "2026-09-09",
    tone: "fleuve",
    rails: ["music", "creators"],
    description: "Une rumba lente, guitare sebene et voix, enregistrée à Matonge.",
  },
  {
    slug: "berceuse-au-piano",
    title: "Berceuse au piano",
    seller: "Sebene Lab",
    verified: false,
    kind: "music",
    priceUsdCents: 0,
    sales: 2650,
    rating: 4.9,
    reviews: 140,
    age: [0, 12],
    format: "MP3 · 4 min 05",
    sizeMb: 10,
    languages: ["fr"],
    license: "personal",
    version: "1.0",
    updatedAt: "2026-05-30",
    tone: "ink",
    rails: ["music", "free"],
    description: "Une berceuse au piano pour endormir les petits, sans paroles.",
  },
  {
    slug: "vendre-sur-whatsapp",
    title: "Vendre sur WhatsApp en 7 jours",
    seller: "Studio Matonge",
    verified: true,
    kind: "course",
    priceUsdCents: 1500,
    promoUsdCents: 1200,
    sales: 532,
    rating: 4.6,
    reviews: 74,
    format: "Formation · 7 modules vidéo",
    sizeMb: 420,
    languages: ["fr", "ln"],
    license: "personal",
    version: "1.2",
    updatedAt: "2026-10-20",
    tone: "ink",
    rails: ["trending", "creators", "deals"],
    description:
      "Catalogue, statuts, listes de diffusion, paiement Mobile Money : sept jours pour transformer ton WhatsApp en boutique.",
  },
  {
    slug: "factures-et-devis-pme",
    title: "Factures et devis pour PME",
    seller: "Bureau Gombe",
    verified: true,
    kind: "template",
    priceUsdCents: 800,
    sales: 211,
    rating: 4.5,
    reviews: 23,
    format: "Excel + Word · 14 modèles",
    sizeMb: 3,
    languages: ["fr"],
    license: "commercial",
    version: "1.0",
    updatedAt: "2026-08-02",
    tone: "paper",
    rails: ["creators"],
    description:
      "Quatorze modèles de factures, devis et reçus en CDF et USD, conformes aux usages congolais.",
  },
  {
    slug: "carte-cadeau-10",
    title: "Carte cadeau 10 $",
    seller: "di.si store",
    verified: true,
    kind: "giftCard",
    priceUsdCents: 1000,
    sales: 2210,
    rating: 5,
    reviews: 45,
    format: "Code envoyé par SMS",
    sizeMb: 0,
    languages: ["fr", "ln", "en"],
    license: "personal",
    version: "—",
    updatedAt: "2026-01-01",
    tone: "laterite",
    rails: ["trending"],
    description: "Offre 10 $ de contenus di.si store à n'importe quel numéro, livrés par SMS et WhatsApp.",
  },
];

const BY_SLUG = new Map(CATALOG.map((p) => [p.slug, p]));

export function getProduct(slug: string): Product | undefined {
  return BY_SLUG.get(slug);
}

export function productsForRail(rail: Rail): Product[] {
  return CATALOG.filter((p) => p.rails.includes(rail));
}

export function effectivePrice(p: Pick<Product, "priceUsdCents" | "promoUsdCents">): number {
  return p.promoUsdCents !== undefined && p.promoUsdCents < p.priceUsdCents
    ? p.promoUsdCents
    : p.priceUsdCents;
}

/** Catégorie di.si store d'un type de produit (repère de couleur et rayons). */
export function categoryOf(kind: Kind): CategoryId | undefined {
  switch (kind) {
    case "ebook":
    case "course":
      return "books";
    case "game":
    case "edu":
      return "apps";
    case "music":
      return "music";
    case "image":
    case "template":
      return "images";
    default:
      return undefined;
  }
}

export const isFree = (p: Pick<Product, "priceUsdCents">) => p.priceUsdCents === 0;
export const isKids = (p: Pick<Product, "kind" | "age">) =>
  p.kind === "game" || p.kind === "edu" || (p.age !== undefined && p.age[1] <= 12);

/** Le contenu est-il autorisé par le contrôle parental (âge maximum) ? */
export function allowedForAge(p: Pick<Product, "age">, maxAge: number): boolean {
  return p.age !== undefined && p.age[0] <= maxAge;
}

/** Données minimales envoyées aux composants client (panier, explorer, bibliothèque). */
export interface ProductSummary {
  slug: string;
  title: string;
  seller: string;
  kind: Kind;
  priceUsdCents: number;
  promoUsdCents?: number;
  rating: number;
  sales: number;
  age?: [number, number];
  format: string;
  sizeMb: number;
  tone: CoverTone;
  platforms?: Platform[];
}

export function summarize(p: Product): ProductSummary {
  return {
    slug: p.slug,
    title: p.title,
    seller: p.seller,
    kind: p.kind,
    priceUsdCents: p.priceUsdCents,
    promoUsdCents: p.promoUsdCents,
    rating: p.rating,
    sales: p.sales,
    age: p.age,
    format: p.format,
    sizeMb: p.sizeMb,
    tone: p.tone,
    platforms: p.platforms ? (Object.keys(p.platforms) as Platform[]) : undefined,
  };
}
