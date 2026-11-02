"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { SUPPORT_WHATSAPP } from "@/lib/brand";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/config";
import { buttonClasses } from "@/components/ui/buttonStyles";
import { IconChat, IconHome, IconSearch } from "@/components/ui/icons";
import { Logo } from "@/components/ui/Logo";

export interface NotFoundTexts {
  title: string;
  body: string;
  cta: string;
  explore: string;
  support: string;
}

const noop = () => () => {};

/**
 * Page « introuvable » : choisit la langue d'après l'adresse demandée (/ln/…, /en/…),
 * propose toujours une sortie (accueil, explorer, support) — jamais de cul-de-sac.
 */
export function NotFoundView({ texts }: { texts: Record<Locale, NotFoundTexts> }) {
  const locale = useSyncExternalStore(
    noop,
    () => {
      const first = window.location.pathname.split("/")[1] ?? "";
      return isLocale(first) ? first : DEFAULT_LOCALE;
    },
    () => DEFAULT_LOCALE,
  );
  const t = texts[locale];
  return (
    <main
      id="contenu"
      lang={locale}
      className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-6 py-10"
    >
      <Logo />
      <p className="mt-6 font-display text-6xl font-extrabold text-muted">404</p>
      <h1 className="text-2xl font-bold">{t.title}</h1>
      <p className="text-muted">{t.body}</p>
      <div className="mt-2 flex flex-col gap-2">
        <Link href={`/${locale}/`} className={buttonClasses({ variant: "primary", size: "lg", block: true })}>
          <IconHome size={18} />
          {t.cta}
        </Link>
        <Link
          href={`/${locale}/explorer/`}
          className={buttonClasses({ variant: "outline", size: "lg", block: true })}
        >
          <IconSearch size={18} />
          {t.explore}
        </Link>
        <a
          href={SUPPORT_WHATSAPP.href}
          rel="noopener"
          className={buttonClasses({ variant: "ghost", block: true })}
        >
          <IconChat size={18} />
          {t.support.replace("{phone}", SUPPORT_WHATSAPP.display)}
        </a>
      </div>
    </main>
  );
}
