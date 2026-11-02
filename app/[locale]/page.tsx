import Link from "next/link";
import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { CouponCard } from "@/components/shop/CouponCard";
import { PreviewButton } from "@/components/shop/PreviewButton";
import { ProductTicket } from "@/components/shop/ProductTicket";
import { metaLine, productHref } from "@/components/shop/labels";
import {
  Chip,
  IconBolt,
  IconBook,
  IconChat,
  IconDownload,
  IconGamepad,
  IconImage,
  IconMusic,
  IconPhone,
  IconSchool,
  ListRow,
  Money,
  Price,
  SearchField,
  TicketCover,
} from "@/components/ui";
import { Countdown } from "@/components/ui/Countdown";
import { CATALOG, effectivePrice, getProduct, productsForRail, type Kind } from "@/lib/catalog";
import { DEMO_COUPONS } from "@/lib/coupons";
import { formatMoney } from "@/lib/currency";
import { localePath } from "@/lib/i18n/config";
import { format, getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";

const CATEGORIES: { kind: Kind; icon: ReactNode }[] = [
  { kind: "game", icon: <IconGamepad /> },
  { kind: "edu", icon: <IconSchool /> },
  { kind: "ebook", icon: <IconBook /> },
  { kind: "image", icon: <IconImage /> },
  { kind: "music", icon: <IconMusic /> },
];

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
  const pack = getProduct("maths-en-s-amusant")!;
  const priceProps = { locale, oldPriceLabel: dict.product.oldPrice, freeLabel: dict.product.free };
  const forYou = [...CATALOG].sort((a, b) => b.sales - a.sales).slice(0, 6);

  return (
    <AppShell
      locale={locale}
      dict={dict}
      tab="home"
      headerExtra={
        <div className="flex flex-col gap-2">
          <SearchField
            action={explore()}
            label={dict.search.label}
            placeholder={dict.search.placeholder}
            submitLabel={dict.search.submit}
          />
          <nav
            aria-label={dict.explore.typeLabel}
            className="scroll-rail -mx-3 flex gap-2 overflow-x-auto px-3"
          >
            <Chip href={explore()} selected onDark>
              {dict.explore.all}
            </Chip>
            {CATEGORIES.map((c) => (
              <Chip key={c.kind} href={explore(`?type=${c.kind}`)} onDark>
                {dict.product.kinds[c.kind]}
              </Chip>
            ))}
            <Chip href={explore("?prix=gratuit")} onDark>
              {dict.product.free}
            </Chip>
          </nav>
        </div>
      }
    >
      {/* Avantages */}
      <ul className="-mx-3 -mt-3 mb-3 flex justify-around bg-mint px-2 py-2 text-[11px] font-semibold text-[#9a3412] dark:bg-surface-2 dark:text-cta">
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

      {/* Bandeau promo (élément principal) */}
      <section
        aria-labelledby="pack-title"
        className="flex items-center gap-3 overflow-hidden rounded-[10px] bg-ink p-4"
      >
        <div className="flex flex-1 flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-[0.6px] text-cta">
            {dict.home.packKicker}
          </span>
          <h1 id="pack-title" className="text-[19px] leading-tight font-bold text-white">
            {dict.home.packTitle}
          </h1>
          <p className="text-[13px] text-white/80">
            <span className="text-lg font-bold text-white">
              <Money usdCents={effectivePrice(pack)} locale={locale} />
            </span>{" "}
            <s className="text-white/60">
              <Money usdCents={pack.priceUsdCents} locale={locale} />
            </s>
          </p>
          <Link
            href={productHref(base, pack.slug)}
            prefetch={false}
            className="btn-primary mt-1 inline-flex h-10 items-center self-start rounded-full px-4 text-[13px] font-bold"
          >
            {dict.home.packCta}
          </Link>
        </div>
        <div className="lite-hide w-28 shrink-0 overflow-hidden rounded-[var(--radius-sm)]">
          <TicketCover tone="fleuve" title={pack.title} />
        </div>
      </section>

      {/* Catégories */}
      <nav aria-label={dict.home.categories} className="card mt-3 grid grid-cols-5 px-1 py-3">
        {CATEGORIES.map((c) => (
          <Link
            key={c.kind}
            href={explore(`?type=${c.kind}`)}
            prefetch={false}
            className="flex min-h-11 flex-col items-center gap-1.5 text-center text-[11px] font-medium"
          >
            <span className="grid size-12 place-items-center rounded-full bg-mint text-[#9a3412] dark:bg-surface-2 dark:text-cta">
              {c.icon}
            </span>
            {dict.product.kinds[c.kind]}
          </Link>
        ))}
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
        <div className="scroll-rail mt-1 flex gap-2.5 overflow-x-auto px-3 [&_.ticket]:shadow-none [&_.ticket]:ring-1 [&_.ticket]:ring-line">
          {productsForRail("deals").map((p) => (
            <ProductTicket key={p.slug} product={p} locale={locale} dict={dict} flash />
          ))}
        </div>
      </section>

      {/* Coupons */}
      <section aria-labelledby="coupons-title" className="mt-3">
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

      {/* Gratuits populaires */}
      <section aria-labelledby="rail-free" className="card mt-3 pb-3">
        <SectionHead
          id="rail-free"
          title={dict.home.rails.free}
          href={explore("?prix=gratuit")}
          seeAll={dict.home.seeAll}
        />
        <div className="scroll-rail mt-1 flex gap-2.5 overflow-x-auto px-3 [&_.ticket]:shadow-none [&_.ticket]:ring-1 [&_.ticket]:ring-line">
          {productsForRail("free")
            .slice(0, 4)
            .map((p) => (
              <ProductTicket key={p.slug} product={p} locale={locale} dict={dict} quickAdd />
            ))}
        </div>
      </section>

      {/* Musique */}
      <section aria-labelledby="rail-music" className="card mt-3">
        <SectionHead
          id="rail-music"
          title={dict.home.rails.music}
          href={explore("?type=music")}
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
