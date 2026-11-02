import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { CategoryIcon, IconBolt, IconChevron, IconDownload, ListRow } from "@/components/ui";
import { Badge } from "@/components/ui/Badge";
import { CATEGORY_IDS, CATEGORY_SLUGS, productsInCategory } from "@/lib/categories";
import { localePath } from "@/lib/i18n/config";
import { format, getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";

export async function generateMetadata({ params }: PageProps<"/[locale]/categories">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLocale(params));
  return { title: dict.categoriesPage.title };
}

export default async function CategoriesPage({ params }: PageProps<"/[locale]/categories">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const t = dict.categoriesPage;
  const explore = (q: string) => `${localePath(locale, "explorer")}${q}`;
  const icon = (node: React.ReactNode) => (
    <span className="grid size-11 place-items-center rounded-[var(--radius-sm)] bg-surface-2 text-fg">
      {node}
    </span>
  );

  return (
    <AppShell locale={locale} dict={dict} tab="categories" path="categories">
      <h1 className="mb-3 mt-1 text-[22px] font-bold">{t.title}</h1>
      <ul className="card overflow-hidden">
        {CATEGORY_IDS.map((id) => {
          const count = productsInCategory(id).length;
          return (
            <ListRow
              key={id}
              href={localePath(locale, `categories/${CATEGORY_SLUGS[id]}`)}
              media={icon(<CategoryIcon id={id} />)}
              title={dict.categories[id]}
              meta={count ? format(t.count, { count }) : t.publish}
              action={
                <span className="flex items-center gap-2">
                  {count ? null : <Badge tone="neutral">{t.soon}</Badge>}
                  <IconChevron size={16} className="text-muted" />
                </span>
              }
            />
          );
        })}
      </ul>

      <h2 className="mb-2 mt-5 px-1 text-[17px] font-bold">{t.shortcuts}</h2>
      <ul className="card overflow-hidden">
        <ListRow
          href={explore("?prix=gratuit")}
          media={icon(<IconDownload />)}
          title={t.free}
          action={<IconChevron size={16} className="text-muted" />}
        />
        <ListRow
          href={explore("?tri=priceAsc")}
          media={icon(<IconBolt className="text-urgent-text" />)}
          title={t.deals}
          action={<IconChevron size={16} className="text-muted" />}
        />
      </ul>
    </AppShell>
  );
}
