import Link from "next/link";
import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { CouponCard } from "@/components/shop/CouponCard";
import { PreviewButton } from "@/components/shop/PreviewButton";
import { ProductTicket } from "@/components/shop/ProductTicket";
import { metaLine, productHref } from "@/components/shop/labels";
import {
  CategoryIcon,
  IconBolt,
  IconChat,
  IconChevron,
  IconDownload,
  IconGrid,
  IconPhone,
  ListRow,
  Money,
  Price,
} from "@/components/ui";
import { Countdown } from "@/components/ui/Countdown";
import { CATALOG, effectivePrice, getProduct, productsForRail } from "@/lib/catalog";
import { CATEGORY_IDS, CATEGORY_SLUGS, productsInCategory } from "@/lib/categories";
import type { CategoryId } from "@/lib/theme";
import { DEMO_COUPONS } from "@/lib/coupons";
import { formatMoney } from "@/lib/currency";
import { localePath } from "@/lib/i18n/config";
import { format, getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";

/** Catégories qui ont déjà des contenus : un rayon chacune sur l'accueil. */
const RAIL_CATEGORIES: CategoryId[] = ["apps", "books", "images"];
const NEW_CATEGORIES: CategoryId[] = ["realestate", "jobs", "tenders"];

function SectionHead({
  id,
  title,
  href,
  seeAll,
  icon,
  extra,
}: {
  id: string;
  title: string;
  href?: string;
  seeAll?: string;
  icon?: ReactNode;
  extra?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-3 pt-2.5">
      <h2 id={id} className="flex items-center gap-1.5 text-[17px] font-bold">
        {icon}
        {title}
      </h2>
      {extra}
      {href && seeAll ? (
        <Link
          href={href}
          prefetch={false}
          className="inline-flex min-h-11 items-center text-[13px] font-semibold text-accent"
        >
          {seeAll}
        </Link>
      ) : null}
    </div>
  );
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const base = localePath(locale);
  const explore = (query = "") => `${localePath(locale, "explorer")}${query}`;
  const category = (id: CategoryId) => localePath(locale, `categories/${CATEGORY_SLUGS[id]}`);
  const pack = getProduct("maths-en-s-amusant")!;
  const priceProps = { locale, oldPriceLabel: dict.product.oldPrice, freeLabel: dict.product.free };
  const forYou = [...CATALOG].sort((a, b) => b.rating * b.reviews - a.rating * a.reviews).slice(0, 6);
  const [bPack, bFlash, bSell] = dict.home.banners;
  const banners = [
    {
      ...bPack,
      href: productHref(base, pack.slug),
      extra: (
        <p className="text-[13px] text-muted">
          <span className="price-tag text-lg">
            <Money usdCents={effectivePrice(pack)} locale={locale} />
          </span>{" "}
          <s className="price-old">
            <Money usdCents={pack.priceUsdCents} locale={locale} />
          </s>
        </p>
      ),
    },
    { ...bFlash, href: explore("?tri=priceAsc"), extra: null },
    { ...bSell, href: localePath(locale, "vendre"), extra: null },
  ];

  return (
    <AppShell locale={locale} dict={dict} tab="home">
      {/* Bandeaux à la une : carrousel horizontal (glisser), le suivant dépasse */}
      <section aria-labelledby="banners-title">
        <h1 id="banners-title" className="sr-only">
          {dict.home.bannersLabel}
        </h1>
        <ul className="scroll-rail -mx-3 flex gap-2.5 overflow-x-auto px-3">
          {banners.map((b, i) => (
            <li key={b.kicker} className="w-[86%] shrink-0 sm:w-[48%]">
              <Link
                href={b.href}
                prefetch={false}
                className="card pressable relative flex h-full min-h-[9.5rem] flex-col gap-1.5 p-4"
              >
                <span className="text-xs font-bold uppercase tracking-[0.6px] text-primary">{b.kicker}</span>
                <span className="font-display text-[19px] font-bold leading-tight">{b.title}</span>
                {b.extra}
                <span className="btn-primary mt-auto inline-flex h-10 items-center self-start rounded-[var(--radius-md)] px-4 text-[13px] font-bold">
                  {b.cta}
                </span>
                <span className="sr-only">
                  {i + 1} / {banners.length}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Avantages */}
      <ul className="mt-2 flex justify-around px-1 py-1 text-[11px] font-semibold text-muted">
        <li className="inline-flex items-center gap-1">
          <IconDownload size={14} />
          {dict.home.trustDelivery}
        </li>
        <li className="inline-flex items-center gap-1">
          <IconPhone size={14} />
          {dict.home.trustPay}
        </li>
        <li className="inline-flex items-center gap-1">
          <IconChat size={14} />
          {dict.home.trustSupport}
        </li>
      </ul>

      {/* Les 7 catégories + toutes */}
      <nav aria-label={dict.home.categories} className="card mt-2 grid grid-cols-4 gap-y-3 px-1 py-3">
        {CATEGORY_IDS.map((id) => (
          <Link
            key={id}
            href={category(id)}
            prefetch={false}
            className="pressable flex min-h-11 flex-col items-center gap-1.5 text-center text-[11px] font-medium leading-tight"
          >
            <span className="grid size-12 place-items-center rounded-full bg-surface-2 text-fg">
              <CategoryIcon id={id} />
            </span>
            {dict.categories[id]}
          </Link>
        ))}
        <Link
          href={localePath(locale, "categories")}
          prefetch={false}
          className="pressable flex min-h-11 flex-col items-center gap-1.5 text-center text-[11px] font-medium leading-tight"
        >
          <span className="grid size-12 place-items-center rounded-full bg-surface-2 text-primary">
            <IconGrid />
          </span>
          {dict.home.allCategories}
        </Link>
      </nav>

      {/* Ventes flash */}
      <section aria-labelledby="rail-flash" className="card mt-3 pb-3">
        <SectionHead
          id="rail-flash"
          title={dict.home.flash}
          icon={<IconBolt size={18} className="text-urgent-text" />}
          href={explore("?tri=priceAsc")}
          seeAll={dict.home.seeAll}
          extra={
            <Countdown until="friday" label={dict.home.dealsEnd} endedLabel={dict.commerce.flashEnded} />
          }
        />
        <div className="scroll-rail mt-1 flex gap-2.5 overflow-x-auto px-3">
          {productsForRail("deals").map((p) => (
            <ProductTicket key={p.slug} product={p} locale={locale} dict={dict} flash />
          ))}
        </div>
      </section>

      {/* Coupons */}
      <section id="coupons" aria-labelledby="coupons-title" className="mt-3 scroll-mt-32">
        <h2 id="coupons-title" className="mb-2 px-1 text-[17px] font-bold">
          {dict.home.coupons}
        </h2>
        <div className="scroll-rail -mx-3 flex gap-2.5 overflow-x-auto px-3">
          {DEMO_COUPONS.map((c) => (
            <CouponCard
              key={c.code}
              code={c.code}
              value={
                c.percent
                  ? format(dict.coupon.percent, { value: c.percent })
                  : format(dict.coupon.amount, { value: formatMoney(c.amountUsdCents ?? 0, "USD", locale) })
              }
              condition={
                c.minSubtotalUsdCents
                  ? format(dict.coupon.min, { amount: formatMoney(c.minSubtotalUsdCents, "USD", locale) })
                  : dict.coupon.all
              }
              labels={{
                claim: dict.coupon.claim,
                claimed: dict.coupon.claimed,
                code: dict.coupon.code,
                auto: dict.coupon.auto,
              }}
            />
          ))}
        </div>
      </section>

      {/* Un rayon par catégorie */}
      {RAIL_CATEGORIES.map((id) => (
        <section key={id} aria-labelledby={`rail-${id}`} className="card mt-3 pb-3">
          <SectionHead
            id={`rail-${id}`}
            title={dict.categories[id]}
            icon={<CategoryIcon id={id} size={18} className="text-muted" />}
            href={category(id)}
            seeAll={dict.home.seeAll}
          />
          <div className="scroll-rail mt-1 flex gap-2.5 overflow-x-auto px-3">
            {productsInCategory(id)
              .slice(0, 6)
              .map((p) => (
                <ProductTicket key={p.slug} product={p} locale={locale} dict={dict} quickAdd />
              ))}
          </div>
        </section>
      ))}

      {/* Musique : écoute directe */}
      <section aria-labelledby="rail-music" className="card mt-3">
        <SectionHead
          id="rail-music"
          title={dict.categories.music}
          icon={<CategoryIcon id="music" size={18} className="text-muted" />}
          href={category("music")}
          seeAll={dict.home.seeAll}
        />
        <ul>
          {productsForRail("music").map((p) => (
            <ListRow
              key={p.slug}
              href={productHref(base, p.slug)}
              lead={
                <PreviewButton
                  id={p.slug}
                  title={p.title}
                  playLabel={format(dict.product.listen, { title: p.title })}
                  pauseLabel={dict.product.pause}
                />
              }
              title={p.title}
              meta={metaLine(p, dict)}
              action={<Price usdCents={p.priceUsdCents} promoUsdCents={p.promoUsdCents} {...priceProps} />}
            />
          ))}
        </ul>
      </section>

      {/* Nouvelles catégories (annonces) */}
      <section aria-labelledby="new-cats" className="card mt-3 pb-1">
        <SectionHead id="new-cats" title={dict.home.newCategories} />
        <p className="px-3 text-[13px] text-muted">{dict.home.newCategoriesBody}</p>
        <ul className="mt-1">
          {NEW_CATEGORIES.map((id) => (
            <ListRow
              key={id}
              href={category(id)}
              media={
                <span className="grid size-10 place-items-center rounded-[var(--radius-sm)] bg-surface-2">
                  <CategoryIcon id={id} size={20} />
                </span>
              }
              title={dict.categories[id]}
              meta={dict.categoriesPage.publish}
              action={<IconChevron size={16} className="text-muted" />}
            />
          ))}
        </ul>
      </section>

      {/* Recommandé pour vous : grille 2 colonnes */}
      <section aria-labelledby="for-you" className="mt-4">
        <div className="mb-1 flex items-center justify-between px-1">
          <h2 id="for-you" className="text-[17px] font-bold">
            {dict.home.forYou}
          </h2>
          <Link
            href={explore("?tri=rating")}
            prefetch={false}
            className="inline-flex min-h-11 items-center text-[13px] font-semibold text-accent"
          >
            {dict.home.seeAll}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {forYou.map((p) => (
            <ProductTicket key={p.slug} product={p} locale={locale} dict={dict} quickAdd />
          ))}
        </div>
      </section>

      <p className="mt-5 text-center text-xs text-muted">{dict.home.trust.operators}</p>
    </AppShell>
  );
}
