import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { LibraryView } from "@/components/shop/LibraryView";
import { metaLine, productHref } from "@/components/shop/labels";
import { CATALOG, summarize } from "@/lib/catalog";
import { localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";

export async function generateMetadata({ params }: PageProps<"/[locale]/bibliotheque">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLocale(params));
  return { title: dict.library.title, robots: { index: false } };
}

export default async function LibraryPage({ params }: PageProps<"/[locale]/bibliotheque">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const products = Object.fromEntries(
    CATALOG.map((p) => [
      p.slug,
      { ...summarize(p), meta: metaLine(p, dict), href: productHref(localePath(locale), p.slug) },
    ]),
  );
  return (
    <AppShell locale={locale} dict={dict} tab="library" path="bibliotheque">
      <h1 className="mb-3 mt-1 text-[22px] font-bold">{dict.library.title}</h1>
      <LibraryView
        products={products}
        locale={locale}
        freeHref={`${localePath(locale, "explorer")}?prix=gratuit`}
        labels={dict.library}
      />
    </AppShell>
  );
}
