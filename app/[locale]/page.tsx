import Link from "next/link";
import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { GetButton } from "@/components/shop/GetButton";
import { PreviewButton } from "@/components/shop/PreviewButton";
import { ProductTicket } from "@/components/shop/ProductTicket";
import { metaLine, productHref } from "@/components/shop/labels";
import {
  Chip,
  IconBook,
  IconGamepad,
  IconImage,
  IconMusic,
  IconSchool,
  ListRow,
  Money,
  Price,
  Rail,
  Rating,
  SearchField,
  Thumb,
  TicketCover,
} from "@/components/ui";
import { Countdown } from "@/components/ui/Countdown";
import { effectivePrice, getProduct, productsForRail, type Kind } from "@/lib/catalog";
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

/** En-tête de section : titre + « Tout voir » (vert foncé sur fond citron, vert sur carte blanche). */
function SectionHead({
  id,
  title,
  href,
  seeAll,
  onCard,
}: {
  id: string;
  title: string;
  href: string;
  seeAll: string;
  onCard?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${onCard ? "px-3.5 pb-1.5" : "mb-2.5"}`}>
      <h2 id={id} className="text-base font-bold">
        {title}
      </h2>
      <Link
        href={href}
        prefetch={false}
        className={`inline-flex min-h-11 items-center text-[13px] font-semibold ${onCard ? "text-accent" : "text-success"}`}
      >
        {seeAll}
      </Link>
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
  const rating = (v: number) => (
    <Rating value={v} locale={locale} label={format(dict.product.rating, { rating: v })} />
  );

  return (
    <AppShell locale={locale} dict={dict} tab="home">
      {/* Recherche + types de contenu */}
      <div className="mt-2 flex flex-col gap-3">
        <SearchField
          action={explore()}
          label={dict.search.label}
          placeholder={dict.search.placeholder}
          submitLabel={dict.search.submit}
        />
        <nav
          aria-label={dict.explore.typeLabel}
          className="scroll-rail -mx-4 flex gap-2 overflow-x-auto px-4"
        >
          <Chip href={explore()} selected>
            {dict.explore.all}
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.kind} href={explore(`?type=${c.kind}`)}>
              {dict.product.kinds[c.kind]}
            </Chip>
          ))}
          <Chip href={explore("?prix=gratuit")}>{dict.product.free}</Chip>
        </nav>
      </div>

      {/* Bandeau promo (élément principal de la page) */}
      <section
        aria-labelledby="pack-title"
        className="mt-3 flex items-center gap-3.5 rounded-[10px] bg-ink p-[18px]"
      >
        <div className="flex flex-1 flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.6px] text-lime-strong">
            {dict.home.packKicker}
          </span>
          <h1 id="pack-title" className="text-lg leading-tight font-bold text-white">
            {dict.home.packTitle}
          </h1>
          <p className="text-[13px] text-steel">
            {format(dict.home.packPrice, { price: "\u0000", old: "\u0001" })
              .split(/(\u0000|\u0001)/)
              .map((part, i) =>
                part === "\u0000" ? (
                  <Money key={i} usdCents={effectivePrice(pack)} locale={locale} />
                ) : part === "\u0001" ? (
                  <Money key={i} usdCents={pack.priceUsdCents} locale={locale} />
                ) : (
                  part
                ),
              )}
          </p>
          <Link
            href={productHref(base, pack.slug)}
            prefetch={false}
            className="mt-1.5 inline-flex h-[38px] items-center self-start rounded-[6px] bg-lime-strong px-3.5 text-[13px] font-semibold text-ink"
          >
            {dict.home.packCta}
          </Link>
        </div>
        <div className="w-24 shrink-0 overflow-hidden rounded-[8px] [&_.cover]:h-28">
          <TicketCover tone="fleuve" title={pack.title} />
        </div>
      </section>

      {/* Catégories */}
      <nav aria-label={dict.home.categories} className="card mt-3 grid grid-cols-5 px-1.5 py-3.5">
        {CATEGORIES.map((c) => (
          <Link
            key={c.kind}
            href={explore(`?type=${c.kind}`)}
            prefetch={false}
            className="flex min-h-11 flex-col items-center gap-1.5 text-center text-xs font-medium"
          >
            <span className="grid size-12 place-items-center rounded-[8px] bg-surface-2">{c.icon}</span>
            {dict.product.kinds[c.kind]}
          </Link>
        ))}
      </nav>

      {/* Gratuits populaires */}
      <section aria-labelledby="rail-free" className="card mt-3 pt-2">
        <SectionHead
          id="rail-free"
          title={dict.home.rails.free}
          href={explore("?prix=gratuit")}
          seeAll={dict.home.seeAll}
          onCard
        />
        <ul>
          {productsForRail("free")
            .slice(0, 3)
            .map((p) => (
              <ListRow
                key={p.slug}
                href={productHref(base, p.slug)}
                media={<Thumb title={p.title} tone={p.tone} round={p.kind === "game" || p.kind === "edu"} />}
                title={p.title}
                meta={metaLine(p, dict)}
                extra={rating(p.rating)}
                action={
                  <GetButton
                    slug={p.slug}
                    title={p.title}
                    getLabel={dict.product.get}
                    openLabel={dict.product.open}
                    libraryHref={localePath(locale, "bibliotheque")}
                  />
                }
              />
            ))}
        </ul>
      </section>

      {/* Offres de la semaine */}
      <Rail
        id="rail-deals"
        title={dict.home.rails.deals}
        action={<Countdown until="friday" label={dict.home.dealsEnd} endedLabel={dict.commerce.flashEnded} />}
      >
        {productsForRail("deals").map((p) => (
          <ProductTicket key={p.slug} product={p} locale={locale} dict={dict} />
        ))}
      </Rail>

      {/* Images et fonds d'écran */}
      <section aria-labelledby="rail-images" className="card mt-4 px-3.5 pb-3.5 pt-2">
        <div className="-mx-3.5">
          <SectionHead
            id="rail-images"
            title={dict.home.rails.images}
            href={explore("?type=image")}
            seeAll={dict.home.seeAll}
            onCard
          />
        </div>
        <ul className="grid grid-cols-3 gap-2">
          {productsForRail("images").map((p) => (
            <li key={p.slug}>
              <Link href={productHref(base, p.slug)} prefetch={false} className="flex flex-col gap-1">
                <span className="block overflow-hidden rounded-[6px] [&_.cover]:h-[120px] [&_.cover-title]:text-[13px]">
                  <TicketCover tone={p.tone} title={p.title} />
                </span>
                <span className="sr-only">{p.title}</span>
                <Price
                  usdCents={p.priceUsdCents}
                  promoUsdCents={p.promoUsdCents}
                  {...priceProps}
                  className="[&_.price-tag]:text-xs [&_.price-old]:hidden"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Musique */}
      <section aria-labelledby="rail-music" className="card mt-3 pt-2">
        <SectionHead
          id="rail-music"
          title={dict.home.rails.music}
          href={explore("?type=music")}
          seeAll={dict.home.seeAll}
          onCard
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
              action={
                <Price
                  usdCents={p.priceUsdCents}
                  promoUsdCents={p.promoUsdCents}
                  {...priceProps}
                  className="[&_.price-tag]:text-[13px]"
                />
              }
            />
          ))}
        </ul>
      </section>

      {(["author", "trending", "creators"] as const).map((rail) => (
        <Rail
          key={rail}
          id={`rail-${rail}`}
          title={dict.home.rails[rail]}
          action={
            <Link
              href={explore()}
              prefetch={false}
              className="inline-flex min-h-11 items-center text-[13px] font-semibold text-success"
            >
              {dict.home.seeAll}
            </Link>
          }
        >
          {productsForRail(rail)
            .slice(0, 4)
            .map((p) => (
              <ProductTicket key={p.slug} product={p} locale={locale} dict={dict} />
            ))}
        </Rail>
      ))}

      <p className="mt-5 text-center text-xs text-muted">
        {dict.home.trustTitle}
        <br />
        {dict.home.trust.operators}
      </p>
    </AppShell>
  );
}
