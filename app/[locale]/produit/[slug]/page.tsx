import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { BuyBar } from "@/components/shop/BuyBar";
import { GiftSheet } from "@/components/shop/GiftSheet";
import { PlatformPicker } from "@/components/shop/PlatformPicker";
import { PreviewGallery } from "@/components/shop/PreviewGallery";
import { PreviewButton } from "@/components/shop/PreviewButton";
import { ProductTicket } from "@/components/shop/ProductTicket";
import {
  ContactLink,
  ReportSheet,
  ReviewsBlock,
  ShareSheet,
  TrackRecent,
} from "@/components/shop/CommonActions";
import {
  FormatPicker,
  LicensePicker,
  ParentalNotice,
  ScreenshotsButton,
  TrackList,
  type OptionChoice,
} from "@/components/shop/ProductOptions";
import { SUPPORT_WHATSAPP } from "@/lib/brand";
import { COMMERCIAL_FACTOR, TRACK_PRICE_USD_CENTS, duration, extrasOf } from "@/lib/productExtras";
import {
  Badge,
  IconCheck,
  IconDownload,
  IconBook,
  IconStar,
  Money,
  Price,
  Thumb,
  buttonClasses,
} from "@/components/ui";
import { Countdown } from "@/components/ui/Countdown";
import {
  CATALOG,
  categoryOf,
  effectivePrice,
  getProduct,
  isFree,
  type Platform,
  type Product,
} from "@/lib/catalog";
import { discountPercent } from "@/lib/currency";
import { localePath } from "@/lib/i18n/config";
import { formatDate } from "@/lib/i18n/dates";
import { format, getDictionary, type Dictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";

export function generateStaticParams() {
  return CATALOG.map((p) => ({ slug: p.slug }));
}

async function load(params: Promise<{ locale: string; slug: string }>) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return { locale, product, dict: await getDictionary(locale) };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/produit/[slug]">): Promise<Metadata> {
  const { product } = await load(params);
  return {
    title: product.title,
    description: product.description,
    openGraph: { title: product.title, description: product.description, type: "website" },
  };
}

function perks(p: Product, dict: Dictionary): string[] {
  const list = [dict.product.perks.instant];
  if (p.kind !== "course" && p.kind !== "giftCard") list.push(dict.product.perks.offline);
  if (p.kind === "game" || p.kind === "edu") list.push(dict.product.perks.noAds);
  if (p.platforms || p.kind === "course" || p.kind === "template") list.push(dict.product.perks.updates);
  if (p.license === "commercial") list.push(dict.product.perks.print);
  return list;
}

const fmtSize = (mb: number) => (mb === 0 ? "—" : `${mb} Mo`);

export default async function ProductPage({ params }: PageProps<"/[locale]/produit/[slug]">) {
  const { locale, product: p, dict } = await load(params);
  const base = localePath(locale);
  const free = isFree(p);
  const percent = p.promoUsdCents ? discountPercent(p.priceUsdCents, p.promoUsdCents) : 0;
  const related = CATALOG.filter((x) => x.kind === p.kind && x.slug !== p.slug).slice(0, 6);
  const priceProps = { locale, oldPriceLabel: dict.product.oldPrice, freeLabel: dict.product.free };
  const x = extrasOf(p);
  const px = dict.px;
  const isAlbum = (x.music?.tracks.length ?? 0) > 1;
  const choices: OptionChoice[] | undefined =
    x.book && x.book.formats.length > 1
      ? x.book.formats.map((f) => ({
          value: `format:${f}`,
          label: px.formats[f],
          cartLabel: format(px.formatLabel, { format: px.formats[f] }),
        }))
      : x.image && !free
        ? (["personal", "commercial"] as const).map((l) => ({
            value: `license:${l}`,
            label: px.licenses[l],
            cartLabel: format(px.licenseLabel, { license: px.licenses[l] }),
            hint: px.licenseHint[l],
            price: (
              <Money
                usdCents={effectivePrice(p) * (l === "commercial" ? COMMERCIAL_FACTOR : 1)}
                locale={locale}
              />
            ),
          }))
        : undefined;
  const extraInfos: [string, string][] = [
    ...(x.book
      ? ([
          [px.author, p.seller],
          ...(x.book.pages ? [[px.pages, format(px.pagesValue, { count: x.book.pages })]] : []),
          [px.format, x.book.formats.map((f) => px.formats[f]).join(", ")],
        ] as [string, string][])
      : []),
    ...(x.app
      ? ([[px.compat, format(px.compatValue, { version: x.app.minAndroid })]] as [string, string][])
      : []),
    ...(x.music
      ? ([
          [px.artist, x.music.artist],
          [px.genre, x.music.genre],
          [px.duration, duration(x.music.tracks.reduce((n, t) => n + t.seconds, 0))],
        ] as [string, string][])
      : []),
    ...(x.image
      ? ([
          [px.resolution, x.image.resolution],
          [px.files, x.image.files],
          [px.orientation, px.orientations[x.image.orientation]],
          [px.color, x.image.color],
          [px.collection, x.image.collection],
        ] as [string, string][])
      : []),
  ];
  const contactHref = `${SUPPORT_WHATSAPP.href}?text=${encodeURIComponent(
    format(dict.actions.contactText, { title: p.title, seller: p.seller }),
  )}`;
  const stats = [
    {
      value: p.rating.toLocaleString(locale === "en" ? "en-US" : "fr-CD", { minimumFractionDigits: 1 }),
      unit: <IconStar size={13} className="text-star" />,
      label: format(dict.product.reviews, { count: p.reviews }),
    },
    p.age
      ? { value: format(dict.product.ageRange, { min: p.age[0], max: p.age[1] }), label: dict.product.age }
      : { value: dict.product.kinds[p.kind], label: dict.product.infos.format },
    { value: fmtSize(p.sizeMb), label: dict.product.size },
    { value: p.sales.toLocaleString(locale === "en" ? "en-US" : "fr-CD"), label: dict.product.purchases },
  ];
  const infos: [string, string][] = [
    ...extraInfos,
    [dict.product.infos.format, p.format],
    [dict.product.infos.version, p.version],
    [dict.product.infos.languages, p.languages.map((l) => dict.product.languageNames[l]).join(", ")],
    [dict.product.infos.license, dict.product.licenseValues[p.license]],
    [dict.product.infos.devices, dict.product.devicesValue],
    [dict.product.infos.updated, formatDate(p.updatedAt, locale)],
    [dict.product.infos.refund, dict.product.refundValue],
  ];

  const nf = locale === "en" ? "en-US" : "fr-CD";

  return (
    <AppShell locale={locale} dict={dict} tab={null} path={`produit/${p.slug}`} back={base} hideNav>
      <TrackRecent id={`p:${p.slug}`} />
      <article className="flex flex-col gap-2.5">
        {/* Galerie */}
        <section aria-labelledby="previews" className="-mx-4 -mt-4">
          <h2 id="previews" className="sr-only">
            {dict.product.previews}
          </h2>
          <PreviewGallery
            category={categoryOf(p.kind)}
            watermark={x.image ? px.watermark : undefined}
            slides={[p.title, `${dict.product.previews} 2/3`, `${dict.product.previews} 3/3`]}
            labels={{
              open: dict.gallery.open,
              prev: dict.gallery.prev,
              next: dict.gallery.next,
              close: dict.sheet.close,
              counter: dict.product.previewItem,
            }}
          />
        </section>

        {/* Prix, titre, note */}
        <section className="card flex flex-col gap-2 p-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <Price usdCents={p.priceUsdCents} promoUsdCents={p.promoUsdCents} size="lg" {...priceProps} />
            {percent > 0 ? <Badge tone="promo">{format(dict.product.discount, { percent })}</Badge> : null}
          </div>
          {percent > 0 ? (
            <div className="flex flex-col items-start gap-1 text-xs text-muted">
              <Countdown until="friday" label={dict.commerce.endsIn} endedLabel={dict.commerce.flashEnded} />
              <span>{dict.product.promoUntil}</span>
            </div>
          ) : null}
          <h1 className="text-[17px] leading-snug font-semibold">{p.title}</h1>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted">
            <span className="inline-flex items-center gap-1">
              <IconStar size={14} className="text-star" />
              <span className="font-semibold text-fg">
                {p.rating.toLocaleString(nf, { minimumFractionDigits: 1 })}
              </span>
              <span>({format(dict.product.reviews, { count: p.reviews })})</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{format(dict.product.sold, { count: p.sales.toLocaleString(nf) })}</span>
          </p>

          <dl className="mt-1 grid grid-cols-4 border-y border-line py-2.5 text-center">
            {stats.map((s, i) => (
              <div key={i} className={i ? "border-l border-line px-1" : "px-1"}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="flex items-center justify-center gap-1 text-sm font-bold">
                  {s.value}
                  {"unit" in s ? s.unit : null}
                </dd>
                <dd aria-hidden="true" className="text-[11px] text-muted">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>

          {p.platforms ? (
            <div className="pt-1">
              <PlatformPicker
                label={dict.product.platformLabel}
                sizeLabel={dict.product.size}
                options={(Object.entries(p.platforms) as [Platform, number][]).map(([id, mb]) => ({
                  id,
                  label: dict.product.platforms[id],
                  name: dict.product.platformNames[id],
                  size: fmtSize(mb),
                }))}
              />
            </div>
          ) : null}
        </section>

        {/* Livraison, garantie, vendeur */}
        <section className="card px-3.5 py-1 text-sm">
          <p className="flex min-h-11 items-center gap-2.5 border-b border-line">
            <IconDownload size={18} className="shrink-0 text-success" />
            <span className="font-medium text-success">{dict.product.deliveryInstant}</span>
          </p>
          <p className="flex min-h-11 items-center gap-2.5 border-b border-line">
            <IconCheck size={18} className="shrink-0 text-success" />
            {dict.product.guarantee}
          </p>
          <p className="flex min-h-11 items-center gap-2.5">
            <Thumb title={p.seller} tone="cendre" size={24} round />
            <span>
              {format(dict.product.seller, { seller: p.seller })}
              {p.verified ? (
                <Badge
                  tone="verified"
                  icon={<IconCheck size={12} />}
                  className="ml-1.5 align-middle text-[11px]"
                >
                  {dict.product.verifiedSeller}
                </Badge>
              ) : null}
              <span className="ml-1.5 text-xs text-muted">
                {format(px.sellerSince, { year: x.sellerSince })}
              </span>
            </span>
          </p>
        </section>

        {/* Options et actions propres à la catégorie */}
        {x.book || x.app || isAlbum || x.image ? (
          <section className="card flex flex-col gap-3 p-3.5">
            {x.book && choices ? <FormatPicker slug={p.slug} label={px.format} choices={choices} /> : null}
            {x.book && p.kind === "ebook" ? (
              <a
                href={`${localePath(locale, "lecteur")}?id=${p.slug}&extrait=1`}
                className={buttonClasses({ variant: "outline", block: true })}
              >
                <IconBook size={18} />
                {px.readExtract}
              </a>
            ) : null}
            {x.app ? (
              <>
                <ScreenshotsButton label={px.screenshots} />
                <ParentalNotice age={p.age} blocked={px.parentalBlocked} ok={px.parentalOk} />
              </>
            ) : null}
            {isAlbum && x.music ? (
              <>
                <h2 className="text-base font-bold">{px.tracks}</h2>
                <TrackList
                  slug={p.slug}
                  tracks={x.music.tracks.map((t) => ({ title: t.title, duration: duration(t.seconds) }))}
                  price={
                    <Money usdCents={Math.min(effectivePrice(p), TRACK_PRICE_USD_CENTS)} locale={locale} />
                  }
                  cartHref={localePath(locale, "panier")}
                  labels={{
                    listen: dict.product.listen,
                    pause: dict.product.pause,
                    buyTrack: px.buyTrack,
                    addPlaylist: px.addPlaylist,
                    removePlaylist: px.removePlaylist,
                    playlistAdded: px.playlistAdded,
                    playlistRemoved: px.playlistRemoved,
                    trackAdded: px.trackAdded,
                    trackLabel: px.trackLabel,
                    viewCart: dict.feedback.viewCart,
                  }}
                />
              </>
            ) : null}
            {x.image && choices ? (
              <>
                <LicensePicker slug={p.slug} label={px.license} choices={choices} />
                <p className="text-xs text-muted">{px.watermarkNote}</p>
              </>
            ) : null}
          </section>
        ) : null}

        {p.kind === "music" ? (
          <div className="card flex items-center gap-3 p-3.5">
            <PreviewButton
              id={p.slug}
              title={p.title}
              playLabel={format(dict.product.listen, { title: p.title })}
              pauseLabel={dict.product.pause}
            />
            <p className="text-sm text-muted">{dict.product.previewDemo}</p>
          </div>
        ) : null}

        {/* Avantages */}
        <ul className="card px-3.5 py-1">
          {perks(p, dict).map((perk) => (
            <li
              key={perk}
              className="flex min-h-11 items-center gap-3 border-b border-line text-sm last:border-b-0"
            >
              <span className="grid size-[22px] shrink-0 place-items-center rounded-full bg-surface-2 text-success">
                <IconCheck size={13} />
              </span>
              {perk}
            </li>
          ))}
        </ul>

        {/* Offrir / partager */}
        <div className="card flex flex-wrap items-center gap-1 px-2 py-1">
          {!free ? (
            <GiftSheet
              slug={p.slug}
              labels={{
                trigger: dict.product.gift,
                title: dict.product.giftTitle,
                body: dict.product.giftBody,
                add: dict.product.giftAdd,
                close: dict.sheet.close,
                phoneLabel: dict.field.phoneLabel,
                phonePlaceholder: dict.field.phonePlaceholder,
                phoneHint: dict.field.phoneHint,
                detected: dict.field.operatorDetected,
                unknown: dict.field.operatorUnknown,
                invalid: dict.cart.phoneInvalid,
              }}
            />
          ) : null}
          <ShareSheet
            path={`${base}/produit/${p.slug}/`}
            text={format(dict.product.shareText, { title: p.title })}
            t={dict.actions}
            closeLabel={dict.sheet.close}
          />
          <ContactLink href={contactHref} label={dict.actions.contact} />
          <ReportSheet slug={p.slug} t={dict.actions} closeLabel={dict.sheet.close} />
        </div>

        <section aria-labelledby="about" className="card flex flex-col gap-2 p-3.5">
          <h2 id="about" className="text-base font-bold">
            {dict.product.about}
          </h2>
          <p className="text-sm leading-relaxed">{p.description}</p>
        </section>

        <section aria-labelledby="details" className="card px-3.5 pb-1 pt-3">
          <h2 id="details" className="text-base font-bold">
            {dict.product.details}
          </h2>
          <dl>
            {infos.map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between gap-3 border-b border-line py-2.5 text-sm last:border-b-0"
              >
                <dt className="text-muted">{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {x.app ? (
          <section aria-labelledby="changelog" className="card flex flex-col gap-2 p-3.5">
            <h2 id="changelog" className="text-base font-bold">
              {format(px.changelog, { version: p.version })}
            </h2>
            <ul className="flex flex-col gap-1.5">
              {x.app.changelog.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm">
                  <IconCheck size={16} className="mt-0.5 shrink-0 text-success" />
                  {c}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="reviews" className="card flex flex-col gap-2 p-3.5">
          <h2 id="reviews" className="text-base font-bold">
            {dict.product.reviewsTitle}
          </h2>
          <p className="flex items-center gap-2">
            <IconStar size={16} className="text-star" />
            <span className="font-bold">{p.rating.toLocaleString(nf, { minimumFractionDigits: 1 })}</span>
            <span className="text-[13px] text-muted">
              {format(dict.product.reviews, { count: p.reviews })}
            </span>
          </p>
          <ReviewsBlock slug={p.slug} t={dict.actions} closeLabel={dict.sheet.close} />
        </section>
      </article>

      {related.length ? (
        <section aria-labelledby="related" className="mt-4">
          <h2 id="related" className="mb-2 px-1 text-[17px] font-bold">
            {dict.actions.similar}
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {related.map((r) => (
              <ProductTicket key={r.slug} product={r} locale={locale} dict={dict} quickAdd />
            ))}
          </div>
        </section>
      ) : null}

      <BuyBar
        slug={p.slug}
        free={free}
        price={<Price usdCents={effectivePrice(p)} {...priceProps} />}
        cartHref={localePath(locale, "panier")}
        libraryHref={localePath(locale, "bibliotheque")}
        choices={choices}
        labels={{
          buy: isAlbum ? px.buyAlbum : dict.product.buyNow,
          addToCart: dict.commerce.addToCart,
          inCart: dict.product.inCart,
          get: dict.product.get,
          open: dict.product.open,
          owned: dict.product.owned,
          favorite: dict.product.favorite,
          unfavorite: dict.product.unfavorite,
        }}
      />
    </AppShell>
  );
}
