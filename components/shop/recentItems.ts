import { listingAmount, listingHref, listingMeta } from "@/components/listings/text";
import { CATALOG } from "@/lib/catalog";
import type { Dictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";
import { LISTINGS } from "@/lib/listings";
import { metaLine, productHref } from "./labels";

export interface RecentItem {
  title: string;
  href: string;
  meta: string;
}

/** Index des fiches (produits « p: », annonces « a: ») pour le rayon « Récemment consultés ». */
export function recentItems(locale: Locale, dict: Dictionary): Record<string, RecentItem> {
  const base = localePath(locale);
  return Object.fromEntries([
    ...CATALOG.map((p) => [
      `p:${p.slug}`,
      { title: p.title, href: productHref(base, p.slug), meta: metaLine(p, dict) },
    ]),
    ...LISTINGS.map((l) => [
      `a:${l.slug}`,
      {
        title: l.title,
        href: listingHref(base, l.slug),
        meta: listingAmount(l, dict) ?? listingMeta(l, dict),
      },
    ]),
  ]);
}
