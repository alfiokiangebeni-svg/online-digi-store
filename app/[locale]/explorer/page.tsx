import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { ExplorerView, type ExploreItem } from "@/components/shop/ExplorerView";
import { metaLine, productHref } from "@/components/shop/labels";
import { CATALOG, summarize, type Kind } from "@/lib/catalog";
import { localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";

const KINDS: Kind[] = ["game", "edu", "ebook", "course", "image", "music", "template", "giftCard"];

export async function generateMetadata({ params }: PageProps<"/[locale]/explorer">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLocale(params));
  return { title: dict.explore.title };
}

export default async function ExplorePage({ params }: PageProps<"/[locale]/explorer">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const items: ExploreItem[] = CATALOG.map((p) => ({
    ...summarize(p),
    meta: metaLine(p, dict),
    href: productHref(localePath(locale), p.slug),
    searchText: [p.title, p.seller, dict.product.kinds[p.kind], p.format, p.description].join(" "),
  }));

  return (
    <AppShell locale={locale} dict={dict} tab="explore" path="explorer">
      <h1 className="mb-4 mt-6 text-4xl font-bold">{dict.explore.title}</h1>
      <ExplorerView
        items={items}
        kinds={KINDS}
        locale={locale}
        labels={{
          searchLabel: dict.search.label,
          searchPlaceholder: dict.search.placeholder,
          typeLabel: dict.explore.typeLabel,
          all: dict.explore.all,
          kinds: dict.product.kinds,
          priceLabel: dict.explore.priceLabel,
          price: dict.explore.price,
          sort: dict.explore.sort,
          sortButton: dict.explore.sortButton,
          count: dict.explore.count,
          none: dict.explore.none,
          reset: dict.explore.reset,
          parental: dict.explore.parental,
          free: dict.product.free,
          oldPrice: dict.product.oldPrice,
          rating: dict.product.rating,
        }}
      />
    </AppShell>
  );
}
