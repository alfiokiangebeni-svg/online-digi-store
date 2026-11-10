import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { ExplorerView, type ExploreItem } from "@/components/shop/ExplorerView";
import { metaLine, productHref } from "@/components/shop/labels";
import { buttonClasses } from "@/components/ui/buttonStyles";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { summarize } from "@/lib/catalog";
import {
  CATEGORY_IDS,
  CATEGORY_KINDS,
  CATEGORY_SLUGS,
  categoryFromSlug,
  productsInCategory,
} from "@/lib/categories";
import { localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";
import { explorerLabels } from "@/components/shop/explorerLabels";
import { ListingsView } from "@/components/listings/ListingsView";
import { listingsPageData } from "@/components/listings/items";
import { isListingCategory } from "@/lib/listings";
import { AlertSwitch, QuoteSheet } from "@/components/listings/ListingActions";

export function generateStaticParams() {
  return CATEGORY_IDS.map((id) => ({ cat: CATEGORY_SLUGS[id] }));
}

async function load(params: Promise<{ locale: string; cat: string }>) {
  const locale = await resolveLocale(params);
  const id = categoryFromSlug((await params).cat);
  if (!id) notFound();
  return { locale, id, dict: await getDictionary(locale) };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/categories/[cat]">): Promise<Metadata> {
  const { id, dict } = await load(params);
  return { title: dict.categories[id] };
}

export default async function CategoryPage({ params }: PageProps<"/[locale]/categories/[cat]">) {
  const { locale, id, dict } = await load(params);
  const t = dict.categoriesPage;
  const items: ExploreItem[] = productsInCategory(id).map((p) => ({
    ...summarize(p),
    meta: metaLine(p, dict),
    href: productHref(localePath(locale), p.slug),
    searchText: [p.title, p.seller, dict.product.kinds[p.kind], p.format, p.description].join(" "),
  }));

  return (
    <AppShell
      locale={locale}
      dict={dict}
      tab="categories"
      path={`categories/${CATEGORY_SLUGS[id]}`}
      back={localePath(locale, "categories")}
      search={false}
    >
      <h1 className="mb-3 mt-1 flex items-center gap-2 text-[22px] font-bold">
        <CategoryIcon id={id} className="text-muted" />
        {dict.categories[id]}
      </h1>
      {isListingCategory(id) ? (
        <>
          <div className="card mb-3 flex flex-col gap-2 px-3.5 py-2">
            <AlertSwitch
              category={id}
              label={id === "jobs" ? dict.listing.alertJobs : dict.listing.alert}
              on={dict.listing.alertOn}
              off={dict.listing.alertOff}
            />
            {id === "tenders" ? (
              <div className="flex flex-wrap gap-2 pb-1.5">
                <QuoteSheet
                  t={dict.listing}
                  field={dict.field}
                  closeLabel={dict.sheet.close}
                  activityHref={`${localePath(locale, "compte")}#activites`}
                  invalidPhone={dict.cart.phoneInvalid}
                  category={dict.categories.tenders}
                />
                <Link
                  href={`${localePath(locale, "vendre")}?categorie=tenders`}
                  className={buttonClasses({ variant: "primary", className: "flex-1" })}
                >
                  {dict.listing.publishTender}
                </Link>
              </div>
            ) : null}
          </div>
          <ListingsView category={id} {...listingsPageData(id, locale, dict)} />
        </>
      ) : items.length ? (
        <ExplorerView
          items={items}
          kinds={CATEGORY_KINDS[id].length > 1 ? CATEGORY_KINDS[id] : []}
          locale={locale}
          labels={explorerLabels(dict)}
        />
      ) : (
        <section className="card flex flex-col items-center gap-3 px-5 py-8 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-surface-2">
            <CategoryIcon id={id} size={28} />
          </span>
          <h2 className="text-lg font-bold">{t.emptyTitle}</h2>
          <p className="text-sm text-muted">{t.emptyBody}</p>
          <Link
            href={localePath(locale, "vendre")}
            className={buttonClasses({ variant: "primary", block: true })}
          >
            {t.publish}
          </Link>
          <Link
            href={localePath(locale, "categories")}
            className={buttonClasses({ variant: "outline", block: true })}
          >
            {t.others}
          </Link>
        </section>
      )}
    </AppShell>
  );
}
