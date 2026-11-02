import type { Kind, Product, ProductSummary } from "@/lib/catalog";
import type { Dictionary } from "@/lib/i18n";
import { format } from "@/lib/i18n/format";

/** Ligne d'information courte : « Éducatif · 5–8 ans · 48 Mo ». */
export function metaLine(
  p: Pick<Product | ProductSummary, "kind" | "age" | "format" | "sizeMb">,
  dict: Dictionary,
) {
  const parts = [dict.product.kinds[p.kind as Kind]];
  if (p.age) parts.push(format(dict.product.ageRange, { min: p.age[0], max: p.age[1] }));
  parts.push(p.format.split(" · ")[1] ?? p.format);
  return parts.join(" · ");
}

export function productHref(localePrefix: string, slug: string) {
  return `${localePrefix}/produit/${slug}`;
}
