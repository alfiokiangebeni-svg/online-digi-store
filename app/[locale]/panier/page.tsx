import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { CartView } from "@/components/shop/CartView";
import { metaLine, productHref } from "@/components/shop/labels";
import { CATALOG, summarize } from "@/lib/catalog";
import { localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";

export async function generateMetadata({ params }: PageProps<"/[locale]/panier">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLocale(params));
  return { title: dict.cart.title, robots: { index: false } };
}

export default async function CartPage({ params }: PageProps<"/[locale]/panier">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const products = Object.fromEntries(
    CATALOG.map((p) => [
      p.slug,
      { ...summarize(p), meta: metaLine(p, dict), href: productHref(localePath(locale), p.slug) },
    ]),
  );

  return (
    <AppShell locale={locale} dict={dict} tab="cart" path="panier">
      <h1 className="mb-4 mt-6 text-4xl font-bold">{dict.cart.title}</h1>
      <CartView
        products={products}
        locale={locale}
        exploreHref={localePath(locale, "explorer")}
        libraryHref={localePath(locale, "bibliotheque")}
        labels={{
          ...dict.cart,
          free: dict.product.free,
          oldPrice: dict.product.oldPrice,
          phoneLabel: dict.field.phoneLabel,
          phonePlaceholder: dict.field.phonePlaceholder,
          phoneHint: dict.field.phoneHint,
          detected: dict.field.operatorDetected,
          unknown: dict.field.operatorUnknown,
          demo: dict.common.demo,
        }}
        payment={{
          ...dict.payment,
          delivered: dict.commerce.delivered,
          flashEnded: dict.commerce.flashEnded,
        }}
      />
    </AppShell>
  );
}
