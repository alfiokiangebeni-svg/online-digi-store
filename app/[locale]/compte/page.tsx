import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { AccountView } from "@/components/shop/AccountView";
import { ActivityView } from "@/components/listings/ActivityView";
import { PlaylistView } from "@/components/shop/ProductOptions";
import { recentItems } from "@/components/shop/recentItems";
import { metaLine, productHref } from "@/components/shop/labels";
import { IconChat, IconChevron, IconDownload } from "@/components/ui";
import { SUPPORT_WHATSAPP } from "@/lib/brand";
import { CATALOG, summarize } from "@/lib/catalog";
import { LOCALES, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";

const LANGUAGE_NAMES = { fr: "Français", ln: "Lingála", en: "English" } as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/compte">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLocale(params));
  return { title: dict.nav.account, robots: { index: false } };
}

export default async function AccountPage({ params }: PageProps<"/[locale]/compte">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const a = dict.account;
  const products = Object.fromEntries(
    CATALOG.map((p) => [
      p.slug,
      { ...summarize(p), meta: metaLine(p, dict), href: productHref(localePath(locale), p.slug) },
    ]),
  );
  const rows: [string, string, string?][] = [
    [a.devices, a.devicesValue],
    [a.payments, a.paymentsValue],
    [a.notifications, a.notificationsValue],
  ];

  return (
    <AppShell locale={locale} dict={dict} tab="account" path="compte">
      <div>
        <AccountView
          products={products}
          locale={locale}
          labels={{
            ...a,
            lite: dict.lite.label,
            liteOn: dict.lite.on,
            liteOff: dict.lite.off,
            free: dict.product.free,
            oldPrice: dict.product.oldPrice,
          }}
          purchases={
            <Link
              href={localePath(locale, "bibliotheque")}
              className="card pressable flex min-h-16 items-center gap-3 px-3.5 py-2 hover:bg-surface-2"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 text-primary-text">
                <IconDownload size={20} />
              </span>
              <span className="flex flex-1 flex-col">
                <span className="text-[15px] font-semibold">{a.purchases}</span>
                <span className="text-xs text-muted">{a.purchasesBody}</span>
              </span>
              <IconChevron size={16} className="text-muted" />
            </Link>
          }
        />
      </div>

      <div className="mt-3">
        <ActivityView
          labels={dict.activity}
          locale={locale}
          categoryNames={dict.categories}
          listings={Object.fromEntries(
            Object.entries(recentItems(locale, dict))
              .filter(([k]) => k.startsWith("a:"))
              .map(([k, v]) => [k.slice(2), v]),
          )}
        />
      </div>

      <div className="mt-3">
        <PlaylistView
          title={dict.px.playlist}
          empty={dict.px.playlistEmpty}
          labels={{
            listen: dict.product.listen,
            pause: dict.product.pause,
            remove: dict.cart.removeShort,
            removed: dict.px.playlistRemoved,
          }}
        />
      </div>

      <section aria-labelledby="lang-title" className="card mt-3 flex flex-col gap-2 p-3.5">
        <h2 id="lang-title" className="text-[15px] font-semibold">
          {a.language}
        </h2>
        <div className="flex gap-2">
          {LOCALES.map((l) => (
            <Link
              key={l}
              href={localePath(l, "compte")}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? "true" : undefined}
              className={`inline-flex h-10 flex-1 items-center justify-center rounded-[var(--radius-sm)] bg-surface-2 text-[13px] ${
                l === locale ? "border-2 border-primary font-semibold" : "border border-line"
              }`}
            >
              {LANGUAGE_NAMES[l]}
            </Link>
          ))}
        </div>
      </section>

      <dl className="card mt-3 px-3.5">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="flex h-[52px] items-center justify-between gap-4 border-b border-surface-2 text-sm last:border-b-0"
          >
            <dt>{k}</dt>
            <dd className="flex items-center gap-2 text-[13px] text-muted">
              {v}
              <span className="rounded-[4px] bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                {a.soon}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="seller-title" className="card mt-3 flex items-center gap-3 p-3.5">
        <div className="flex flex-1 flex-col gap-1">
          <h2 id="seller-title" className="text-[15px] font-semibold">
            {a.seller}
          </h2>
          <p className="text-xs text-muted">{a.sellerBody}</p>
        </div>
        <Link
          href={localePath(locale, "vendre")}
          className="btn-primary inline-flex h-10 shrink-0 items-center rounded-[var(--radius-md)] px-3 text-[13px] font-semibold"
        >
          {a.sellerCta}
        </Link>
      </section>

      <div className="card mt-3 px-3.5">
        <a
          href={SUPPORT_WHATSAPP.href}
          rel="noopener"
          className="flex h-[52px] items-center justify-between text-sm"
        >
          <span className="inline-flex items-center gap-2.5">
            <IconChat size={18} />
            {a.help}
          </span>
          <IconChevron size={16} className="text-muted" />
        </a>
      </div>
    </AppShell>
  );
}
