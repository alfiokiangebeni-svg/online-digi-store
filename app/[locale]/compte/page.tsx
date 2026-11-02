import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { AccountView } from "@/components/shop/AccountView";
import { metaLine, productHref } from "@/components/shop/labels";
import { IconChat, IconChevron } from "@/components/ui";
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
  const sellerHref = `${SUPPORT_WHATSAPP.href}?text=${encodeURIComponent(a.sellerCta)}`;
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
              className={`inline-flex h-10 flex-1 items-center justify-center rounded-[6px] bg-surface text-[13px] ${
                l === locale ? "border-2 border-fg font-semibold" : "border border-steel"
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

      <section
        aria-labelledby="seller-title"
        className="mt-3 flex items-center gap-3 rounded-[10px] bg-ink p-3.5"
      >
        <div className="flex flex-1 flex-col gap-1">
          <h2 id="seller-title" className="text-[15px] font-semibold text-white">
            {a.seller}
          </h2>
          <p className="text-xs text-steel">{a.sellerBody}</p>
        </div>
        <a
          href={sellerHref}
          rel="noopener"
          className="inline-flex h-[38px] shrink-0 items-center rounded-[6px] bg-lime-strong px-3 text-[13px] font-semibold text-ink"
        >
          {a.sellerCta}
        </a>
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
