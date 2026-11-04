"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import errorTexts from "@/lib/i18n/dictionaries/errors.json";

/** Textes de l'écran d'erreur (petit fichier dédié : le dictionnaire complet n'est pas chargé ici). */
const TEXTS = errorTexts;

const noop = () => () => {};

/** Écran d'erreur : message clair en français (ou ln / en) avec « Réessayer ». */
export default function ErrorScreen({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const lang = useSyncExternalStore(
    noop,
    () => (window.location.pathname.split("/")[1] as keyof typeof TEXTS) ?? "fr",
    () => "fr" as const,
  );
  const t = TEXTS[lang] ?? TEXTS.fr;
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main id="contenu" className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-6">
      <Logo />
      <h1 className="mt-4 text-2xl font-bold">{t.title}</h1>
      <p className="text-muted">{t.body}</p>
      <Button size="lg" block onClick={reset}>
        {t.retry}
      </Button>
      <Button href={`/${lang in TEXTS ? lang : "fr"}/`} variant="outline" block>
        {t.home}
      </Button>
    </main>
  );
}
