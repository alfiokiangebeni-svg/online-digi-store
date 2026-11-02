import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { metaLine, productHref } from "@/components/shop/labels";
import { ReaderView } from "@/components/shop/ReaderView";
import { CATALOG, summarize } from "@/lib/catalog";
import { localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";

export async function generateMetadata({ params }: PageProps<"/[locale]/lecteur">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLocale(params));
  return { title: dict.reader.title, robots: { index: false } };
}

/** Lecteur : ouvre un contenu de la bibliothèque (?id=slug). */
export default async function ReaderPage({ params }: PageProps<"/[locale]/lecteur">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const products = Object.fromEntries(
    CATALOG.map((p) => [
      p.slug,
      { ...summarize(p), meta: metaLine(p, dict), href: productHref(localePath(locale), p.slug) },
    ]),
  );
  return (
    <AppShell
      locale={locale}
      dict={dict}
      tab="library"
      path="lecteur"
      back={localePath(locale, "bibliotheque")}
    >
      <h1 className="mb-3 text-[22px] font-bold">{dict.reader.title}</h1>
      <ReaderView
        products={products}
        libraryHref={localePath(locale, "bibliotheque")}
        labels={{
          ...dict.reader,
          soon: dict.feedback.soon,
          listen: dict.product.listen,
          pause: dict.product.pause,
        }}
      />
    </AppShell>
  );
}
