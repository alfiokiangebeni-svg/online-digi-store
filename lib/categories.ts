import { CATALOG, type Kind, type Product } from "@/lib/catalog";
import { CATEGORY_IDS, type CategoryId } from "@/lib/theme";

/**
 * Les 7 catégories di.si store : adresse (en français, stable), types de contenus
 * rattachés. Immobilier, emplois et appels d'offres n'ont pas encore d'annonces de démo
 * (étape 5) : leur page affiche un état vide avec « Publier une annonce ».
 */
export const CATEGORY_SLUGS: Record<CategoryId, string> = {
  books: "livres",
  apps: "applications",
  realestate: "immobilier",
  jobs: "emplois",
  music: "musique",
  images: "images",
  tenders: "appels-d-offres",
};

export const CATEGORY_KINDS: Record<CategoryId, Kind[]> = {
  books: ["ebook", "course"],
  apps: ["game", "edu"],
  realestate: [],
  jobs: [],
  music: ["music"],
  images: ["image", "template"],
  tenders: [],
};

export { CATEGORY_IDS };

export function categoryFromSlug(slug: string): CategoryId | undefined {
  return CATEGORY_IDS.find((id) => CATEGORY_SLUGS[id] === slug);
}

export function productsInCategory(id: CategoryId): Product[] {
  const kinds = CATEGORY_KINDS[id];
  return CATALOG.filter((p) => kinds.includes(p.kind)).sort((a, b) => b.sales - a.sales);
}
