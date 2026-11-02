import Link from "next/link";
import type { ReactNode } from "react";
import { LOCALES, localePath, type Locale } from "@/lib/i18n/config";
import { format, type Dictionary } from "@/lib/i18n";
import { SUPPORT_WHATSAPP } from "@/lib/brand";
import {
  BottomNav,
  IconBack,
  IconCart,
  IconChat,
  IconDownload,
  IconHome,
  IconMe,
  IconSearch,
} from "@/components/ui";
import { CartBadge } from "@/components/ui/CartBadge";
import { CurrencyToggle } from "@/components/ui/CurrencyToggle";

export type Tab = "home" | "explore" | "library" | "cart" | "account" | null;

const LANGUAGE_NAMES: Record<Locale, string> = { fr: "Français", ln: "Lingála", en: "English" };

/** Gabarit commun : en-tête, contenu, pied de page, barre de navigation. */
export function AppShell({
  locale,
  dict,
  tab,
  path = "",
  back,
  hideNav,
  headerExtra,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  tab: Tab;
  /** Chemin courant sans préfixe de langue, pour le sélecteur de langue. */
  path?: string;
  /** Lien « Retour » à la place du logo (fiches produit). */
  back?: string;
  /** Masque la barre du bas (remplacée par une barre d'achat). */
  hideNav?: boolean;
  /** Contenu ajouté dans l'en-tête bleu nuit (recherche, filtres). */
  headerExtra?: React.ReactNode;
  children: ReactNode;
}) {
  const cartLabel = dict.header.cartCount;
  const nav = [
    { key: "home", href: localePath(locale), label: dict.nav.home, icon: <IconHome /> },
    { key: "explore", href: localePath(locale, "explorer"), label: dict.nav.explore, icon: <IconSearch /> },
    {
      key: "library",
      href: localePath(locale, "bibliotheque"),
      label: dict.nav.library,
      icon: <IconDownload />,
    },
    {
      key: "cart",
      href: localePath(locale, "panier"),
      label: dict.nav.cart,
      icon: <IconCart />,
      badge: <CartBadge srTemplate={cartLabel} />,
    },
    { key: "account", href: localePath(locale, "compte"), label: dict.nav.account, icon: <IconMe /> },
  ].map(({ key, ...item }) => ({ ...item, active: key === tab }));

  return (
    <>
      <a
        href="#contenu"
        className="sr-only z-50 bg-ink px-4 py-3 font-medium text-white focus:not-sr-only focus:fixed focus:left-2 focus:top-2"
      >
        {dict.a11y.skipToContent}
      </a>
      <header className="sticky top-0 z-30 bg-header text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 pt-1.5">
          {back ? (
            <Link
              href={back}
              aria-label={dict.product.back}
              className="-ml-2 grid size-11 place-items-center rounded-[8px] hover:bg-white/10"
            >
              <IconBack />
            </Link>
          ) : (
            <Link
              href={localePath(locale)}
              aria-label={dict.a11y.home}
              className="flex min-h-11 items-center text-[22px] font-bold tracking-[-0.6px]"
            >
              digistore<span className="text-cta">.</span>
            </Link>
          )}
          <div role="group" aria-label={dict.a11y.settings} className="flex items-center gap-1">
            <CurrencyToggle label={dict.header.currency} onDark />
            <Link
              href={localePath(locale, "panier")}
              prefetch={false}
              aria-label={dict.header.cart}
              className="relative grid size-11 place-items-center rounded-[8px] hover:bg-white/10"
            >
              <span className="relative">
                <IconCart size={24} />
                <CartBadge srTemplate={cartLabel} />
              </span>
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 pb-2.5 pt-1">{headerExtra}</div>
      </header>

      <main id="contenu" className="mx-auto max-w-5xl px-3 pb-6 pt-3">
        {children}
      </main>

      <footer className={`mx-auto max-w-5xl px-4 pt-2 text-xs text-muted ${hideNav ? "pb-36" : "pb-24"}`}>
        <a
          href={SUPPORT_WHATSAPP.href}
          rel="noopener"
          className="inline-flex min-h-11 items-center gap-2 font-semibold text-fg hover:underline"
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

      {hideNav ? null : <BottomNav items={nav} label={dict.a11y.mainNav} />}
    </>
  );
}
