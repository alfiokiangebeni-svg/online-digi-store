import type { Locale } from "./config";

const TAGS: Record<Locale, string> = { fr: "fr-CD", ln: "fr-CD", en: "en-US" };

/** « 28 oct. 2026 » — le lingala utilise le format de date français. */
export function formatDate(iso: string | number, locale: Locale): string {
  return new Intl.DateTimeFormat(TAGS[locale], {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Kinshasa",
  }).format(new Date(iso));
}
