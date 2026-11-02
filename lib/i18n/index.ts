import "server-only";
import type { Locale } from "./config";
import fr from "./dictionaries/fr.json";

export type Dictionary = typeof fr;

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  fr: async () => fr,
  ln: () => import("./dictionaries/ln.json").then((m) => m.default as Dictionary),
  en: () => import("./dictionaries/en.json").then((m) => m.default as Dictionary),
};

/** Dictionnaire complet d'une langue — côté serveur uniquement. */
export function getDictionary(locale: Locale): Promise<Dictionary> {
  return loaders[locale]();
}

export { format } from "./format";
