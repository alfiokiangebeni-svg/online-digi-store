import type { Dictionary } from "@/lib/i18n";
import { format } from "@/lib/i18n/format";
import type { Listing } from "@/lib/listings";

export const listingHref = (localePrefix: string, slug: string) => `${localePrefix}/annonce/${slug}`;

const nf = new Intl.NumberFormat("fr-CD");
export const usd = (n: number) => nf.format(n);

/** Libellé du type d'annonce : « Appartement », « CDI », « Énergie »… */
export function listingKind(l: Listing, dict: Dictionary): string {
  if (l.category === "realestate") return dict.listing.types[l.type];
  if (l.category === "jobs") return dict.listing.contracts[l.contract];
  return l.sector;
}

/** Ligne courte sous le titre : commune, chambres, surface / contrat, lieu / organisme. */
export function listingMeta(l: Listing, dict: Dictionary): string {
  const t = dict.listing;
  if (l.category === "realestate") {
    return [
      l.commune,
      l.bedrooms ? format(t.bedrooms, { count: l.bedrooms }) : null,
      format(t.area, { area: l.areaM2 }),
      l.furnished ? t.furnished : null,
    ]
      .filter(Boolean)
      .join(" · ");
  }
  if (l.category === "jobs")
    return [l.publisher, t.contracts[l.contract], t.modes[l.mode], l.commune].join(" · ");
  return [l.publisher, format(t.reference, { ref: l.reference })].join(" · ");
}

/** Texte de prix pour les offres et appels d'offres (USD, montants annoncés tels quels). */
export function listingAmount(l: Listing, dict: Dictionary): string | null {
  if (l.category === "jobs")
    return l.salaryUsd
      ? format(dict.listing.salary, { min: usd(l.salaryUsd[0]), max: usd(l.salaryUsd[1]) })
      : dict.listing.salaryNegotiable;
  if (l.category === "tenders")
    return format(dict.listing.budget, { min: usd(l.budgetUsd[0]), max: usd(l.budgetUsd[1]) });
  return null;
}

/** Texte de recherche (titre, annonceur, commune, secteur…). */
export function listingSearchText(l: Listing, dict: Dictionary): string {
  return [l.title, l.publisher, l.commune, listingKind(l, dict), l.description].join(" ");
}
