import type { Product } from "@/lib/catalog";

/**
 * Détails propres à chaque catégorie de produit (démo) : formats et pages des livres,
 * compatibilité et notes de mise à jour des applis, titres des albums, licence et
 * caractéristiques des images. Phase 2 : colonnes de la table produits.
 */
export type BookFormat = "pdf" | "epub" | "audio";
export type Orientation = "landscape" | "portrait" | "square";

export interface Extras {
  /** Année d'arrivée du vendeur sur di.si store (ancienneté). */
  sellerSince: number;
  book?: { formats: BookFormat[]; pages?: number };
  app?: { minAndroid: string; changelog: string[] };
  music?: { artist: string; genre: string; tracks: { title: string; seconds: number }[] };
  image?: { resolution: string; files: string; orientation: Orientation; color: string; collection: string };
}

/** Prix d'un titre acheté seul dans un album (cents USD). */
export const TRACK_PRICE_USD_CENTS = 49;
/** La licence commerciale coûte 3 fois la licence personnelle. */
export const COMMERCIAL_FACTOR = 3;

const SINCE: Record<string, number> = {
  "L'auteur": 2024,
  "Studio Bana": 2023,
  "Okapi Games": 2023,
  "Atelier Lingwala": 2024,
  "Sebene Lab": 2025,
  "Studio Matonge": 2024,
  "Bureau Gombe": 2025,
  "di.si store": 2023,
};

const BY_SLUG: Record<string, Omit<Extras, "sellerSince">> = {
  "kinshasa-mode-emploi": { book: { formats: ["epub", "pdf", "audio"], pages: 184 } },
  "le-fleuve-et-nous": { book: { formats: ["epub", "pdf"], pages: 240 } },
  "vendre-sur-whatsapp": { book: { formats: ["pdf"] } },
  "maths-en-s-amusant": {
    app: {
      minAndroid: "7.0",
      changelog: ["Niveau 6 : les multiplications", "Mode hors-ligne amélioré", "Voix en lingala"],
    },
  },
  "les-lettres-en-couleurs": {
    app: { minAndroid: "6.0", changelog: ["Tracé des lettres au doigt", "Correctifs"] },
  },
  "puzzle-des-animaux": {
    app: { minAndroid: "7.0", changelog: ["10 nouveaux puzzles d'animaux de la forêt"] },
  },
  "compter-avec-nono": { app: { minAndroid: "6.0", changelog: ["Compter jusqu'à 100", "Sons plus doux"] } },
  "course-des-petites-voitures": {
    app: { minAndroid: "8.0", changelog: ["Circuit du boulevard du 30 Juin", "Meilleure fluidité"] },
  },
  "comptines-du-matin": {
    music: {
      artist: "L'auteur",
      genre: "Enfants",
      tracks: [
        "Bonjour le soleil",
        "Mama ya ngai",
        "Les petits poissons",
        "Tolamuka",
        "Un, deux, trois, on y va",
        "Le marché de Gambela",
        "Mbote moninga",
        "La pluie qui chante",
        "Les couleurs du pagne",
        "Biso na biso",
        "Le train du matin",
        "À l'école",
      ].map((title, i) => ({ title, seconds: 95 + ((i * 37) % 80) })),
    },
  },
  "rumba-douce": {
    music: { artist: "Sebene Lab", genre: "Rumba", tracks: [{ title: "Rumba douce", seconds: 222 }] },
  },
  "berceuse-au-piano": {
    music: {
      artist: "Sebene Lab",
      genre: "Piano, berceuse",
      tracks: [{ title: "Berceuse au piano", seconds: 245 }],
    },
  },
  "pack-20-fonds-d-ecran": {
    image: {
      resolution: "3840 × 2160",
      files: "JPG",
      orientation: "landscape",
      color: "Vert",
      collection: "Fonds d'écran",
    },
  },
  "coloriages-a-imprimer": {
    image: {
      resolution: "A4 · 300 dpi",
      files: "PDF",
      orientation: "portrait",
      color: "Noir et blanc",
      collection: "Enfants",
    },
  },
  "motifs-kuba-vectoriels": {
    image: {
      resolution: "Vectoriel (sans limite)",
      files: "SVG, PNG",
      orientation: "square",
      color: "Ocre",
      collection: "Motifs congolais",
    },
  },
  "factures-et-devis-pme": {
    image: {
      resolution: "A4",
      files: "XLSX, DOCX",
      orientation: "portrait",
      color: "Gris",
      collection: "Bureau",
    },
  },
};

export function extrasOf(p: Pick<Product, "slug" | "seller">): Extras {
  return { sellerSince: SINCE[p.seller] ?? 2025, ...BY_SLUG[p.slug] };
}

/** Prix d'une ligne de panier selon l'option choisie (titre seul, licence commerciale). */
export function optionPrice(baseUsdCents: number, option?: string): number {
  if (option?.startsWith("track:")) return Math.min(baseUsdCents, TRACK_PRICE_USD_CENTS);
  if (option === "license:commercial") return baseUsdCents * COMMERCIAL_FACTOR;
  return baseUsdCents;
}

/** Durée « 3 min 42 ». */
export const duration = (s: number) => `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")}`;
