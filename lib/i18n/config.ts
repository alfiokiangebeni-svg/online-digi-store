export const LOCALES = ["fr", "ln", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Chemin localisé : /fr/…, /ln/…, /en/… (la racine « / » sert /fr sans redirection). */
export function localePath(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+/, "");
  return `/${locale}${clean ? `/${clean}` : ""}`;
}
