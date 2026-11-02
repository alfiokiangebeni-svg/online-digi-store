import Link from "next/link";
import type { ReactNode } from "react";
import { LOCALES, localePath, type Locale } from "@/lib/i18n/config";
import { format, type Dictionary } from "@/lib/i18n";
import { SUPPORT_WHATSAPP } from "@/lib/brand";
import { BottomNav, IconChat, IconDiscover, IconLibrary, IconMe, IconSearch } from "@/components/ui";
import { LiteToggle } from "@/components/ui/LiteToggle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export type Tab = "discover" | "search" | "library" | "me" | null;

const LANGUAGE_NAMES: Record<Locale, string> = { fr: "Français", ln: "Lingála", en: "English" };

/** Gabarit commun : en-tête, contenu, pied de page, barre de navigation. */
export function AppShell({
  locale,
  dict,
  tab,
  path = "",
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  tab: Tab;
  /** Chemin courant sans préfixe de langue, pour le sélecteur de langue. */
  path?: string;
  children: ReactNode;
}) {
  const nav = [
    { key: "discover", href: localePath(locale), label: dict.nav.discover, icon: <IconDiscover /> },
    { key: "search", href: localePath(locale, "recherche"), label: dict.nav.search, icon: <IconSearch /> },
    {
      key: "library",
      href: localePath(locale, "bibliotheque"),
      label: dict.nav.library,
      icon: <IconLibrary />,
    },
    { key: "me", href: localePath(locale, "moi"), label: dict.nav.me, icon: <IconMe /> },
  ].map(({ key, ...item }) => ({ ...item, active: key === tab }));

  return (
    <>
      <a
        href="#contenu"
        className="sr-only z-50 bg-taxi px-4 py-3 font-medium text-ink focus:not-sr-only focus:fixed focus:left-2 focus:top-2"
      >
        {dict.a11y.skipToContent}
      </a>
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 pt-3">
        <Link
          href={localePath(locale)}
          aria-label={dict.a11y.home}
          className="flex min-h-11 items-center font-display text-xl font-bold uppercase tracking-tight"
        >
          Digi<span className="ml-1 border-b-4 border-laterite leading-none">Store</span>
        </Link>
        <div role="group" aria-label={dict.a11y.settings} className="flex items-center gap-1">
          <LiteToggle label={dict.lite.label} onText={dict.lite.on} offText={dict.lite.off} />
          <ThemeToggle toLight={dict.theme.toLight} toDark={dict.theme.toDark} />
        </div>
      </header>

      <main id="contenu" className="mx-auto max-w-5xl px-4 pb-8">
        {children}
      </main>

      <footer className="mx-auto max-w-5xl border-t-2 border-line px-4 pb-24 pt-6 text-sm text-muted">
        <a
          href={SUPPORT_WHATSAPP.href}
          rel="noopener"
          className="inline-flex min-h-11 items-center gap-2 font-medium text-fg hover:underline"
        >
          <IconChat size={18} />
          {format(dict.footer.support, { phone: SUPPORT_WHATSAPP.display })}
        </a>
        <nav aria-label={dict.footer.languages} className="mt-2 flex flex-wrap items-center gap-x-1">
          <span className="mr-2">{dict.footer.languages} :</span>
          {LOCALES.map((l) => (
            <Link
              key={l}
              href={localePath(l, path)}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? "true" : undefined}
              prefetch={false}
              className="inline-flex min-h-11 items-center px-2 aria-[current=true]:font-medium aria-[current=true]:text-fg aria-[current=true]:underline"
            >
              {LANGUAGE_NAMES[l]}
            </Link>
          ))}
        </nav>
      </footer>

      <BottomNav items={nav} label={dict.a11y.mainNav} />
    </>
  );
}
