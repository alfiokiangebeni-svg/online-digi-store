import type { Dictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";
import { listingsIn, type ListingCategory } from "@/lib/listings";
import { DeadlineBadge } from "./DeadlineBadge";
import type { ListingItem, ListingsLabels } from "./ListingsView";
import type { ListingHit } from "./ListingResults";
import { RentPrice } from "./RentPrice";
import { listingAmount, listingHref, listingMeta, listingSearchText } from "./text";

/** Annonces d'une catégorie prêtes pour la liste filtrable, avec ses filtres. */
export function listingsPageData(category: ListingCategory, locale: Locale, dict: Dictionary) {
  const t = dict.listing;
  const base = localePath(locale);
  const items: ListingItem[] = listingsIn(category).map((l) => ({
    slug: l.slug,
    href: listingHref(base, l.slug),
    title: l.title,
    meta: listingMeta(l, dict),
    searchText: listingSearchText(l, dict),
    group: l.category === "realestate" ? l.type : l.category === "jobs" ? l.contract : l.sector,
    mode: l.category === "jobs" ? l.mode : undefined,
    furnished: l.category === "realestate" ? l.furnished : undefined,
    price:
      l.category === "realestate"
        ? l.priceUsdCents
        : l.category === "jobs"
          ? (l.salaryUsd?.[0] ?? 0)
          : l.budgetUsd[0],
    postedDaysAgo: l.postedDaysAgo,
    deadlineDays: l.category === "realestate" ? undefined : l.deadlineDays,
    amount:
      l.category === "realestate" ? (
        <RentPrice
          usdCents={l.priceUsdCents}
          template={l.unit === "month" ? t.perMonth : t.perDay}
          locale={locale}
        />
      ) : (
        listingAmount(l, dict)
      ),
    badge: l.category === "realestate" ? null : <DeadlineBadge days={l.deadlineDays} label={t.deadline} />,
  }));
  const unique = (values: string[]) => [...new Set(values)];
  const listings = listingsIn(category);
  const groups =
    category === "realestate"
      ? unique(listings.map((l) => (l.category === "realestate" ? l.type : ""))).map((v) => ({
          value: v,
          label: t.types[v as keyof typeof t.types],
        }))
      : category === "jobs"
        ? unique(listings.map((l) => (l.category === "jobs" ? l.contract : ""))).map((v) => ({
            value: v,
            label: t.contracts[v as keyof typeof t.contracts],
          }))
        : unique(listings.map((l) => (l.category === "tenders" ? l.sector : ""))).map((v) => ({
            value: v,
            label: v,
          }));
  const modes =
    category === "jobs"
      ? (["onsite", "remote", "hybrid"] as const).map((v) => ({ value: v, label: t.modes[v] }))
      : undefined;
  const sorts = (
    category === "realestate"
      ? ["recent", "priceAsc"]
      : category === "jobs"
        ? ["recent", "deadline"]
        : ["deadline", "recent"]
  ) as ("recent" | "priceAsc" | "deadline")[];
  const labels: ListingsLabels = {
    searchLabel: dict.search.label,
    searchPlaceholder: t.searchPlaceholder,
    groupLabel:
      category === "realestate"
        ? t.filters.type
        : category === "jobs"
          ? t.filters.contract
          : t.filters.sector,
    modeLabel: t.filters.mode,
    all: t.filters.all,
    furnishedOnly: t.filters.furnishedOnly,
    sort: t.filters.sort,
    sorts: t.filters.sorts,
    count: t.count,
    none: t.none,
    reset: t.reset,
  };
  return { items, groups, modes, sorts, labels };
}

/** Toutes les annonces, pour la recherche globale (Explorer). */
export function listingHits(locale: Locale, dict: Dictionary): ListingHit[] {
  return (["realestate", "jobs", "tenders"] as const).flatMap((c) =>
    listingsPageData(c, locale, dict).items.map((i) => ({
      slug: i.slug,
      href: i.href,
      title: i.title,
      meta: i.meta,
      searchText: i.searchText,
      category: c,
      amount: i.amount,
    })),
  );
}
