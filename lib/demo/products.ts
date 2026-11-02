import type { CoverTone } from "@/components/ui/Ticket";

/**
 * Catalogue de démonstration (phase 1). Remplacé par la base Supabase en phase 2.
 * Les titres sont du contenu vendeur : ils ne passent pas par les fichiers de traduction.
 */
export type ProductKind = "ebook" | "course" | "kidsApp" | "audio" | "template" | "giftCard";
export type Rail = "trending" | "under5" | "author" | "kids" | "creators";

export interface DemoProduct {
  id: string;
  title: string;
  seller: string;
  verified: boolean;
  kind: ProductKind;
  priceUsdCents: number;
  promoUsdCents?: number;
  sales: number;
  rating: number;
  tone: CoverTone;
  isNew?: boolean;
  rails: Rail[];
}

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: "p1",
    title: "Kinshasa, mode d'emploi",
    seller: "L'auteur",
    verified: true,
    kind: "ebook",
    priceUsdCents: 699,
    promoUsdCents: 499,
    sales: 1240,
    rating: 4.8,
    tone: "laterite",
    rails: ["trending", "author", "under5"],
  },
  {
    id: "p2",
    title: "Lire avec Mbote le perroquet",
    seller: "L'auteur",
    verified: true,
    kind: "kidsApp",
    priceUsdCents: 399,
    sales: 860,
    rating: 4.9,
    tone: "fleuve",
    rails: ["kids", "author", "under5"],
  },
  {
    id: "p3",
    title: "Vendre sur WhatsApp en 7 jours",
    seller: "Studio Matonge",
    verified: true,
    kind: "course",
    priceUsdCents: 1500,
    promoUsdCents: 1200,
    sales: 532,
    rating: 4.6,
    tone: "ink",
    rails: ["trending", "creators"],
  },
  {
    id: "p4",
    title: "Rumba : 12 boucles de guitare",
    seller: "Sebene Lab",
    verified: false,
    kind: "audio",
    priceUsdCents: 450,
    sales: 318,
    rating: 4.4,
    tone: "cendre",
    isNew: true,
    rails: ["creators", "under5"],
  },
  {
    id: "p5",
    title: "Les chiffres en lingala",
    seller: "L'auteur",
    verified: true,
    kind: "kidsApp",
    priceUsdCents: 299,
    sales: 640,
    rating: 4.7,
    tone: "laterite",
    rails: ["kids", "under5"],
  },
  {
    id: "p6",
    title: "Factures et devis pour PME",
    seller: "Bureau Gombe",
    verified: true,
    kind: "template",
    priceUsdCents: 800,
    sales: 211,
    rating: 4.5,
    tone: "paper",
    rails: ["creators", "trending"],
  },
  {
    id: "p7",
    title: "Le fleuve et nous",
    seller: "L'auteur",
    verified: true,
    kind: "ebook",
    priceUsdCents: 899,
    sales: 402,
    rating: 4.9,
    tone: "fleuve",
    isNew: true,
    rails: ["author"],
  },
  {
    id: "p8",
    title: "Contes du soir, saison 1",
    seller: "L'auteur",
    verified: true,
    kind: "audio",
    priceUsdCents: 499,
    sales: 977,
    rating: 4.8,
    tone: "ink",
    rails: ["kids", "author", "trending"],
  },
  {
    id: "p9",
    title: "Excel pour les commerçants",
    seller: "Académie Limete",
    verified: false,
    kind: "course",
    priceUsdCents: 1900,
    sales: 154,
    rating: 4.3,
    tone: "cendre",
    rails: ["creators"],
  },
  {
    id: "p10",
    title: "Carte cadeau 10 $",
    seller: "Digi Store",
    verified: true,
    kind: "giftCard",
    priceUsdCents: 1000,
    sales: 2210,
    rating: 5,
    tone: "laterite",
    rails: ["trending"],
  },
];

export function productsForRail(rail: Rail): DemoProduct[] {
  return DEMO_PRODUCTS.filter((p) => p.rails.includes(rail));
}
