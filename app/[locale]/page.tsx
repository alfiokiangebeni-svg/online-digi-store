import Link from "next/link";
import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { CouponCard } from "@/components/shop/CouponCard";
import { PreviewButton } from "@/components/shop/PreviewButton";
import { ProductTicket } from "@/components/shop/ProductTicket";
import { metaLine, productHref } from "@/components/shop/labels";
import {
  CategoryIcon,
  Chip,
  IconBolt,
  IconChat,
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
import { isListingCategory, listingsIn } from "@/lib/listings";
import { ListingTicket } from "@/components/listings/ListingTicket";
import { RecentRail } from "@/components/shop/RecentRail";
import { recentItems } from "@/components/shop/recentItems";
import type { CategoryId } from "@/lib/theme";
import { DEMO_COUPONS } from "@/lib/coupons";
import { formatMoney } from "@/lib/currency";
import { localePath } from "@/lib/i18n/config";
import { format, getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";

/** Catégories qui ont déjà des contenus : un rayon chacune sur l'accueil. */
/** Rayons de l'accueil, dans l'ordre (la musique a son propre rayon à écouter). */
const RAILS: CategoryId[] = ["realestate", "jobs", "apps", "books", "tenders", "images"];

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
  // Fil « Pour toi » façon place de marché : tout le catalogue en 2 colonnes.
  const forYou = [...CATALOG].sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
  const [bPack, bFlash, bSell] = dict.home.banners;
  const banners = [
    {
      ...bPack,
      href: productHref(base, pack.slug),
      extra: (
        <p className="text-[13px]">
          <span className="price-tag text-lg">
            <Money usdCents={effectivePrice(pack)} locale={locale} />
          </span>{" "}
          <s className="price-old">
            <Money usdCents={pack.priceUsdCents} locale={locale} />
          </s>
        </p>
      ),
    },
    { ...bFlash, href: explore("?tri=priceAsc"), extra: null, terre: true },
    { ...bSell, href: localePath(locale, "vendre"), extra: null },
  ];

  return (
    <AppShell
      locale={locale}
      dict={dict}
      tab="home"
      headerExtra={
        <nav aria-label={dict.home.tabsLabel} className="scroll-rail -mx-4 flex gap-2 overflow-x-auto px-4">
          <Chip href={base} selected>
            {dict.home.forYou}
          </Chip>
          {CATEGORY_IDS.map((id) => (
            <Chip key={id} href={category(id)}>
              {dict.categories[id]}
            </Chip>
          ))}
        </nav>
      }
    >
      {/* Bandeaux à la une : carrousel horizontal (glisser), le suivant dépasse */}
      <section aria-labelledby="banners-title">
        <h1 id="banners-title" className="sr-only">
          {dict.home.bannersLabel}
        </h1>
        <ul className="scroll-rail -mx-4 flex gap-2.5 overflow-x-auto px-4">
          {banners.map((b, i) => (
            <li key={b.kicker} className="w-[90%] shrink-0 sm:w-[48%]">
              <Link
                href={b.href}
                prefetch={false}
                className={`pressable relative flex h-full min-h-[11rem] flex-col gap-2 rounded-[var(--radius-lg)] p-5 text-on-accent ring-1 ring-champagne/70 ${"terre" in b ? "bg-terre-strong" : "bg-night"} [&_.price-old]:text-on-accent/60 [&_.price-tag]:text-on-accent`}
              >
                <span className="text-xs font-bold uppercase tracking-[0.8px] text-champagne">
                  {b.kicker}
                </span>
                <span className="font-display text-[21px] font-bold leading-tight">{b.title}</span>
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
      <ul className="mt-3 flex justify-around px-1 py-1 text-[11px] font-semibold text-muted">
        <li className="inline-flex items-center gap-1">
          <IconDownload size={14} className="text-terre" />
          {dict.home.trustDelivery}
        </li>
        <li className="inline-flex items-center gap-1">
          <IconPhone size={14} className="text-terre" />
          {dict.home.trustPay}
        </li>
        <li className="inline-flex items-center gap-1">
          <IconChat size={14} className="text-terre" />
          {dict.home.trustSupport}
        </li>
      </ul>

      {/* Les 7 catégories + toutes */}
      <nav aria-label={dict.home.categories} className="card mt-3 grid grid-cols-4 gap-y-5 px-2 py-5">
        {CATEGORY_IDS.map((id) => (
          <Link
            key={id}
            href={category(id)}
            prefetch={false}
            className="pressable flex min-h-11 flex-col items-center gap-1.5 text-center text-[11px] font-medium leading-tight"
          >
            <span className="grid size-14 place-items-center rounded-full bg-terre-soft text-terre-deep">
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
          <span className="grid size-14 place-items-center rounded-full bg-primary text-on-primary">
            <IconGrid />
          </span>
          {dict.home.allCategories}
        </Link>
      </nav>

      {/* Ventes flash */}
      <section aria-labelledby="rail-flash" className="card mt-5 pb-4">
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
      <section id="coupons" aria-labelledby="coupons-title" className="mt-5 scroll-mt-32">
        <h2 id="coupons-title" className="mb-2 px-1 text-[17px] font-bold">
          {dict.home.coupons}
        </h2>
        <div className="scroll-rail -mx-4 flex gap-2.5 overflow-x-auto px-4">
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
      {RAILS.map((id) => (
        <section key={id} aria-labelledby={`rail-${id}`} className="card mt-5 pb-4">
          <SectionHead
            id={`rail-${id}`}
            title={
              id in dict.homeRails ? dict.homeRails[id as keyof typeof dict.homeRails] : dict.categories[id]
            }
            icon={<CategoryIcon id={id} size={18} className="text-terre" />}
            href={category(id)}
            seeAll={dict.home.seeAll}
          />
          <div className="scroll-rail mt-1 flex gap-2.5 overflow-x-auto px-3">
            {isListingCategory(id)
              ? listingsIn(id).map((l) => (
                  <ListingTicket key={l.slug} listing={l} locale={locale} dict={dict} />
                ))
              : productsInCategory(id)
                  .slice(0, 6)
                  .map((p) => (
                    <ProductTicket key={p.slug} product={p} locale={locale} dict={dict} quickAdd />
                  ))}
          </div>
        </section>
      ))}

      {/* Top musique : écoute directe */}
      <section aria-labelledby="rail-music" className="card mt-5">
        <SectionHead
          id="rail-music"
          title={dict.homeRails.music}
          icon={<CategoryIcon id="music" size={18} className="text-terre" />}
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

      <RecentRail title={dict.actions.recent} items={recentItems(locale, dict)} />

      {/* Recommandé pour vous : grille 2 colonnes */}
      <section aria-labelledby="for-you" className="mt-6">
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {forYou.map((p) => (
            <ProductTicket key={p.slug} product={p} locale={locale} dict={dict} quickAdd />
          ))}
        </div>
      </section>

      <p className="mt-5 text-center text-xs text-muted">{dict.home.trust.operators}</p>
    </AppShell>
  );
}
