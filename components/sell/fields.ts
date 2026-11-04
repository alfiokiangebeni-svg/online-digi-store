import type { CategoryId } from "@/lib/theme";

/** Champs du formulaire de publication, adaptés à chaque catégorie. */
export type FieldKind = "text" | "number" | "textarea" | "select" | "switch" | "chips";

export interface FieldDef {
  name: string;
  kind: FieldKind;
  /** Clés des choix (select, chips). */
  options?: string[];
}

const T = (name: string, kind: FieldKind = "text", options?: string[]): FieldDef => ({ name, kind, options });

/** Prix de la mise en avant « Booster mon annonce » (7 jours), en cents USD. */
export const BOOST_USD_CENTS = 500;

/** Champ du montant principal selon la catégorie. */
export const PRICE_FIELD: Record<CategoryId, string> = {
  books: "price",
  apps: "price",
  music: "price",
  images: "price",
  realestate: "rent",
  jobs: "salary",
  tenders: "budget",
};

export const FIELDS: Record<CategoryId, FieldDef[]> = {
  books: [T("price", "number"), T("formats", "chips", ["pdf", "epub", "audio"]), T("pages", "number")],
  apps: [T("price", "number"), T("version"), T("size", "number"), T("age", "number")],
  realestate: [
    T("type", "select", ["apartment", "house", "office", "hall", "land"]),
    T("rent", "number"),
    T("commune"),
    T("quartier"),
    T("bedrooms", "number"),
    T("furnished", "switch"),
  ],
  jobs: [
    T("contract", "select", ["cdi", "cdd", "internship", "freelance"]),
    T("mode", "select", ["onsite", "remote", "hybrid"]),
    T("salary", "number"),
    T("commune"),
    T("sector"),
    T("deadline", "number"),
  ],
  music: [T("price", "number"), T("genre"), T("tracks", "number")],
  images: [T("price", "number"), T("license", "select", ["personal", "commercial"]), T("resolution")],
  tenders: [T("sector"), T("budget", "number"), T("deadline", "number"), T("documents", "textarea")],
};
