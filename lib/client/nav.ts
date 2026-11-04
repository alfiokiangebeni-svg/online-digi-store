"use client";

import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, isLocale, localePath, type Locale } from "@/lib/i18n/config";

/** Langue de l'écran courant, lue dans l'adresse (/fr/…, /ln/…, /en/…). */
export function useLocale(): Locale {
  const first = usePathname()?.split("/")[1] ?? "";
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

/** Chemin localisé depuis un composant client. */
export function useLocalePath() {
  const locale = useLocale();
  return (path = "") => localePath(locale, path);
}
