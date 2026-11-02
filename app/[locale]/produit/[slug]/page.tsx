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
  Badge,
  IconCheck,
  IconDownload,
  IconShare,
  IconStar,
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
  // Lien vers la fiche si le site public est configuré (absent dans l'APK de test).
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(
    [format(dict.product.shareText, { title: p.title }), site ? `${site}${base}/produit/${p.slug}/` : ""]
      .filter(Boolean)
      .join(" "),
  )}`;
  const related = CATALOG.filter((x) => x.kind === p.kind && x.slug !== p.slug).slice(0, 6);
  const priceProps = { locale, oldPriceLabel: dict.product.oldPrice, freeLabel: dict.product.free };
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
      <article className="flex flex-col gap-2.5">
        {/* Galerie */}
        <section aria-labelledby="previews" className="-mx-3 -mt-3">
          <h2 id="previews" className="sr-only">
            {dict.product.previews}
          </h2>
          <PreviewGallery
            category={categoryOf(p.kind)}
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
            </span>
          </p>
        </section>

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
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener"
            className={buttonClasses({ variant: "ghost", className: "px-2" })}
          >
            <IconShare size={18} />
            {dict.product.share}
          </a>
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
          <p className="text-[13px] leading-relaxed text-muted">{dict.product.reviewsEmpty}</p>
        </section>
      </article>

      {related.length ? (
        <section aria-labelledby="related" className="mt-4">
          <h2 id="related" className="mb-2 px-1 text-[17px] font-bold">
            {dict.product.related}
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
        labels={{
          buy: dict.product.buyNow,
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
