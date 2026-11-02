import "server-only";
import { LOCALES, type Locale } from "./config";
import { getDictionary } from "./index";
import type { NotFoundTexts } from "@/components/feedback/NotFoundView";

/** Textes de la page 404 dans les 3 langues (seuls ces champs partent vers le navigateur). */
export async function notFoundTexts(): Promise<Record<Locale, NotFoundTexts>> {
  const entries = await Promise.all(
    LOCALES.map(async (l) => {
      const d = await getDictionary(l);
      return [l, { ...d.notFound, explore: d.nav.categories, support: d.footer.support }] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<Locale, NotFoundTexts>;
}
