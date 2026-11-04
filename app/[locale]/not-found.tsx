import { NotFoundView } from "@/components/feedback/NotFoundView";
import { notFoundTexts } from "@/lib/i18n/not-found-texts";

/** Adresse inconnue sous /fr, /ln ou /en (la langue est lue dans l'adresse). */
export default async function NotFound() {
  return <NotFoundView texts={await notFoundTexts()} />;
}
