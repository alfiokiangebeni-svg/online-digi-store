import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { ExplorerView, type ExploreItem } from "@/components/shop/ExplorerView";
import { metaLine, productHref } from "@/components/shop/labels";
import { explorerLabels } from "@/components/shop/explorerLabels";
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
    <AppShell locale={locale} dict={dict} tab="categories" path="explorer" search={false}>
      <h1 className="mb-3 mt-1 text-[22px] font-bold">{dict.explore.title}</h1>
      <ExplorerView items={items} kinds={KINDS} locale={locale} labels={explorerLabels(dict)} />
    </AppShell>
  );
}
