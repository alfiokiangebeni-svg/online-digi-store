import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { BuyBar } from "@/components/shop/BuyBar";
import { GiftSheet } from "@/components/shop/GiftSheet";
import { PlatformPicker } from "@/components/shop/PlatformPicker";
import { PreviewButton } from "@/components/shop/PreviewButton";
import { ProductTicket } from "@/components/shop/ProductTicket";
import {
  Badge,
  IconCheck,
  IconShare,
  IconStar,
  Price,
  Rail,
  Thumb,
  TicketCover,
  buttonClasses,
} from "@/components/ui";
import { Countdown } from "@/components/ui/Countdown";
import {
  CATALOG,
  effectivePrice,
  getProduct,
  isFree,
  isKids,
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
  const kids = isKids(p);
  const percent = p.promoUsdCents ? discountPercent(p.priceUsdCents, p.promoUsdCents) : 0;
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(
    `${format(dict.product.shareText, { title: p.title })} ${site}${base}/produit/${p.slug}`,
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

  return (
    <AppShell locale={locale} dict={dict} tab={null} path={`produit/${p.slug}`} back={base} hideNav>
      <article className="mt-1 flex flex-col gap-3">
        {/* Carte principale */}
        <section className="card flex flex-col gap-3.5 p-4">
          <header className="flex gap-3.5">
            <Thumb title={p.title} tone={p.tone} size={84} round={kids} />
            <div className="flex min-w-0 flex-col gap-0.5">
              <h1 className="text-[19px] leading-tight font-bold">{p.title}</h1>
              <p className="text-[13px] font-medium text-accent">
                {p.seller}
                {p.verified ? (
                  <Badge
                    tone="verified"
                    icon={<IconCheck size={12} />}
                    className="ml-1.5 align-middle text-[11px]"
                  >
                    {dict.product.verifiedSeller}
                  </Badge>
                ) : null}
              </p>
              <p className="text-xs text-muted">
                {dict.product.kinds[p.kind]} · {dict.product.licenseValues[p.license]}
              </p>
            </div>
          </header>

          <dl className="grid grid-cols-4 border-y border-line py-2.5 text-center">
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
          ) : null}

          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <Price usdCents={p.priceUsdCents} promoUsdCents={p.promoUsdCents} size="lg" {...priceProps} />
            {percent > 0 ? (
              <span className="text-xs font-bold text-promo">
                {format(dict.product.discount, { percent })} · {dict.product.promoUntil}
              </span>
            ) : null}
          </div>
          {percent > 0 ? (
            <Countdown until="friday" label={dict.commerce.endsIn} endedLabel={dict.commerce.flashEnded} />
          ) : null}
        </section>

        {/* Aperçus */}
        <section aria-labelledby="previews">
          <h2 id="previews" className="sr-only">
            {dict.product.previews}
          </h2>
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
          ) : (
            <ul className="scroll-rail -mx-4 flex gap-2 overflow-x-auto px-4">
              {(["cendre", p.tone, "paper"] as const).map((tone, i) => (
                <li key={i} className="w-[132px] shrink-0 overflow-hidden rounded-[8px] [&_.cover]:h-[236px]">
                  <span className="sr-only">{format(dict.product.previewItem, { n: i + 1, total: 3 })}</span>
                  <TicketCover
                    tone={tone}
                    title={i === 0 ? p.title : `${dict.product.previews} ${i + 1}/3`}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Avantages */}
        <ul className="card px-4 py-1.5">
          {perks(p, dict).map((perk) => (
            <li
              key={perk}
              className="flex min-h-12 items-center gap-3 border-b border-surface-2 text-sm last:border-b-0"
            >
              <span className="grid size-[22px] shrink-0 place-items-center rounded-full bg-lime text-leaf-strong">
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

        <section aria-labelledby="about" className="card flex flex-col gap-2 p-4">
          <h2 id="about" className="text-base font-bold">
            {dict.product.about}
          </h2>
          <p className="text-sm leading-relaxed text-[#3a3f47] dark:text-muted">{p.description}</p>
        </section>

        <section aria-labelledby="details" className="card px-4 py-1">
          <h2 id="details" className="sr-only">
            {dict.product.details}
          </h2>
          <dl>
            {infos.map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between gap-3 border-b border-surface-2 py-3 text-sm last:border-b-0"
              >
                <dt className="text-muted">{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="reviews" className="card flex flex-col gap-2 p-4">
          <h2 id="reviews" className="text-base font-bold">
            {dict.product.reviewsTitle}
          </h2>
          <p className="flex items-center gap-2">
            <IconStar size={16} className="text-star" />
            <span className="font-bold">
              {p.rating.toLocaleString(locale === "en" ? "en-US" : "fr-CD", { minimumFractionDigits: 1 })}
            </span>
            <span className="text-[13px] text-muted">
              {format(dict.product.reviews, { count: p.reviews })}
            </span>
          </p>
          <p className="text-[13px] leading-relaxed text-muted">{dict.product.reviewsEmpty}</p>
        </section>
      </article>

      {related.length ? (
        <Rail id="related" title={dict.product.related}>
          {related.map((r) => (
            <ProductTicket key={r.slug} product={r} locale={locale} dict={dict} />
          ))}
        </Rail>
      ) : null}

      <BuyBar
        slug={p.slug}
        free={free}
        price={<Price usdCents={effectivePrice(p)} {...priceProps} />}
        cartHref={localePath(locale, "panier")}
        libraryHref={localePath(locale, "bibliotheque")}
        labels={{
          buy: dict.product.buy,
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
