import type { Metadata } from "next";
import "./globals.css";
import { NotFoundView } from "@/components/feedback/NotFoundView";
import { fontVariables } from "@/lib/fonts";
import { notFoundTexts } from "@/lib/i18n/not-found-texts";

export const metadata: Metadata = { title: "404 · di.si store", robots: { index: false } };

/**
 * Adresse inconnue hors des langues (ex. /de, /xyz) et page 404.html de l'export
 * (APK) : page de la boutique avec des sorties, au lieu de la page anglaise par défaut.
 */
export default async function GlobalNotFound() {
  return (
    <html lang="fr" className={fontVariables}>
      <body>
        <NotFoundView texts={await notFoundTexts()} />
      </body>
    </html>
  );
}
