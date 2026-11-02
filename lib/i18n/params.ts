import { notFound } from "next/navigation";
import { isLocale, LOCALES, type Locale } from "./config";

export function localeStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/** Valide le segment [locale] ; 404 sinon. */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}
