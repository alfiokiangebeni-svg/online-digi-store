import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { AccountView } from "@/components/shop/AccountView";
import { metaLine, productHref } from "@/components/shop/labels";
import { IconChat, IconChevron, KubaDivider, buttonClasses } from "@/components/ui";
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
      <div className="mt-6">
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

      <section aria-labelledby="lang-title" className="mt-6">
        <h2 id="lang-title" className="text-sm font-medium">
          {a.language}
        </h2>
        <div className="mt-2 flex gap-2">
          {LOCALES.map((l) => (
            <Link
              key={l}
              href={localePath(l, "compte")}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? "true" : undefined}
              className={buttonClasses({
                variant: l === locale ? "secondary" : "ghost",
                className: "min-h-11 flex-1 px-2 text-sm",
              })}
            >
              {LANGUAGE_NAMES[l]}
            </Link>
          ))}
        </div>
      </section>

      <dl className="mt-6">
        {rows.map(([k, v]) => (
          <div key={k} className="flex min-h-12 items-center justify-between gap-4 border-b-2 border-line">
            <dt>{k}</dt>
            <dd className="flex items-center gap-2 text-sm text-muted">
              {v}
              <span className="border border-line px-1.5 text-[11px] uppercase">{a.soon}</span>
            </dd>
          </div>
        ))}
      </dl>

      <KubaDivider id="kuba-account" />

      <section
        aria-labelledby="seller-title"
        className="ticket flex flex-col items-start gap-3 bg-surface p-5"
      >
        <h2 id="seller-title" className="text-2xl font-bold">
          {a.seller}
        </h2>
        <p className="text-muted">{a.sellerBody}</p>
        <p className="text-sm">{a.sellerSoon}</p>
        <a href={sellerHref} rel="noopener" className={buttonClasses({ variant: "secondary" })}>
          {a.sellerCta}
          <IconChevron size={18} />
        </a>
      </section>

      <a
        href={SUPPORT_WHATSAPP.href}
        rel="noopener"
        className="mt-6 flex min-h-12 items-center gap-3 border-b-2 border-line font-medium"
      >
        <IconChat size={20} />
        {a.help}
      </a>
    </AppShell>
  );
}
