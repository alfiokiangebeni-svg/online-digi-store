import Link from "next/link";
import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { GetButton } from "@/components/shop/GetButton";
import { PreviewButton } from "@/components/shop/PreviewButton";
import { ProductTicket } from "@/components/shop/ProductTicket";
import { metaLine, productHref } from "@/components/shop/labels";
import {
  Badge,
  Chip,
  IconBook,
  IconGamepad,
  IconImage,
  IconMusic,
  IconSchool,
  KubaDivider,
  ListRow,
  Price,
  Rail,
  Rating,
  SearchField,
  Story,
  Thumb,
  TicketCover,
} from "@/components/ui";
import { Countdown } from "@/components/ui/Countdown";
import { getProduct, productsForRail, type Kind } from "@/lib/catalog";
import { localePath } from "@/lib/i18n/config";
import { format, getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";

const DROPS = [
  "kinshasa-mode-emploi",
  "vendre-sur-whatsapp",
  "comptines-du-matin",
  "maths-en-s-amusant",
  "pack-20-fonds-d-ecran",
];
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
}: {
  id: string;
  title: string;
  href: string;
  seeAll: string;
}) {
  return (
    <div className="mb-2 flex items-end justify-between gap-4">
      <h2 id={id} className="text-2xl font-bold">
        {title}
      </h2>
      <Link
        href={href}
        prefetch={false}
        className="inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4"
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
  const drops = DROPS.map((s) => getProduct(s)!);
  const pack = getProduct("maths-en-s-amusant")!;
  const priceProps = { locale, oldPriceLabel: dict.product.oldPrice, freeLabel: dict.product.free };

  return (
    <AppShell locale={locale} dict={dict} tab="home">
      {/* Recherche + types de contenu */}
      <div className="mt-3 flex flex-col gap-3">
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

      {/* Héros : drop du jour */}
      <section aria-labelledby="hero-title" className="pt-7">
        <Badge tone="flash">{dict.home.kicker}</Badge>
        <h1 id="hero-title" className="mt-3 max-w-[16ch] text-[2.4rem] font-bold sm:text-6xl">
          {dict.home.title}
        </h1>
        <p className="mt-3 max-w-prose text-muted">{dict.home.body}</p>
        <ul className="mt-3 text-sm text-muted">
          <li className="font-mono">{dict.home.trust.operators}</li>
          <li>{dict.home.trust.delivery}</li>
        </ul>
      </section>

      <section id="drops" aria-labelledby="drops-title" className="mt-6">
        <h2 id="drops-title" className="sr-only">
          {dict.home.storiesLabel}
        </h2>
        <ul className="scroll-rail -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
          {drops.map((p, i) => (
            <li key={p.slug}>
              <Link href={productHref(base, p.slug)} prefetch={false}>
                <Story title={p.title} tone={p.tone} seen={i > 2} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Pack mis en avant */}
      <section aria-labelledby="pack-title" className="ticket mt-6 flex items-stretch gap-4 bg-surface p-4">
        <div className="flex flex-1 flex-col items-start gap-2">
          <Badge tone="new">{dict.home.packKicker}</Badge>
          <h2 id="pack-title" className="text-xl font-bold">
            {dict.home.packTitle}
          </h2>
          <Price usdCents={pack.priceUsdCents} promoUsdCents={pack.promoUsdCents} {...priceProps} />
          <Link
            href={productHref(base, pack.slug)}
            prefetch={false}
            className="mt-1 inline-flex min-h-11 items-center border-2 border-fg px-4 text-sm font-medium rounded-[var(--radius-control)] hover:bg-fg hover:text-bg"
          >
            {dict.home.packCta}
          </Link>
        </div>
        <div className="kids w-28 shrink-0 overflow-hidden rounded-[18px]">
          <TicketCover id="pack" tone={pack.tone} title={pack.title} kids />
        </div>
      </section>

      {/* Catégories */}
      <nav aria-label={dict.home.categories} className="mt-6 grid grid-cols-5 gap-1">
        {CATEGORIES.map((c) => (
          <Link
            key={c.kind}
            href={explore(`?type=${c.kind}`)}
            prefetch={false}
            className="flex min-h-11 flex-col items-center gap-1.5 py-1 text-center text-xs font-medium"
          >
            <span className="grid size-12 place-items-center bg-surface-2 rounded-[var(--radius-control)]">
              {c.icon}
            </span>
            {dict.product.kinds[c.kind]}
          </Link>
        ))}
      </nav>

      <KubaDivider id="kuba-home-1" />

      {/* Gratuits populaires */}
      <section aria-labelledby="rail-free">
        <SectionHead
          id="rail-free"
          title={dict.home.rails.free}
          href={explore("?prix=gratuit")}
          seeAll={dict.home.seeAll}
        />
        <ul>
          {productsForRail("free")
            .slice(0, 4)
            .map((p) => (
              <ListRow
                key={p.slug}
                href={productHref(base, p.slug)}
                media={
                  <Thumb
                    id={`free-${p.slug}`}
                    title={p.title}
                    tone={p.tone}
                    round={p.kind === "game" || p.kind === "edu"}
                  />
                }
                title={p.title}
                meta={metaLine(p, dict)}
                extra={<Rating value={p.rating} label={format(dict.product.rating, { rating: p.rating })} />}
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

      {/* Images */}
      <section aria-labelledby="rail-images" className="mt-8">
        <SectionHead
          id="rail-images"
          title={dict.home.rails.images}
          href={explore("?type=image")}
          seeAll={dict.home.seeAll}
        />
        <ul className="grid grid-cols-3 gap-2">
          {productsForRail("images").map((p) => (
            <li key={p.slug}>
              <Link href={productHref(base, p.slug)} prefetch={false} className="flex flex-col gap-1.5">
                <span className="block overflow-hidden rounded-[4px]">
                  <TicketCover id={`img-${p.slug}`} tone={p.tone} title={p.title} />
                </span>
                <span className="sr-only">{p.title}</span>
                <Price usdCents={p.priceUsdCents} promoUsdCents={p.promoUsdCents} {...priceProps} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Musique */}
      <section aria-labelledby="rail-music" className="mt-8">
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

      <KubaDivider id="kuba-home-2" />

      {(["author", "trending", "creators"] as const).map((rail) => (
        <Rail
          key={rail}
          id={`rail-${rail}`}
          title={dict.home.rails[rail]}
          action={
            <Link
              href={explore()}
              prefetch={false}
              className="inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4"
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
    </AppShell>
  );
}
