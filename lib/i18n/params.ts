import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, isLocale, LOCALES, type Locale } from "./config";

export function localeStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/** Valide le segment [locale] ; 404 sinon. */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

/**
 * Langue pour la mise en page racine : ne lève jamais d'erreur (une langue inconnue,
 * ex. /de, retombe sur le français) afin que la page elle-même renvoie la 404 de la boutique.
 */
export async function layoutLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}
