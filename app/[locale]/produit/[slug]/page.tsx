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
  KubaDivider,
  Price,
  Rail,
  Thumb,
  TicketCover,
  buttonClasses,
} from "@/components/ui";
import { Countdown } from "@/components/ui/Countdown";
import { CATALOG, getProduct, isFree, isKids, type Platform, type Product } from "@/lib/catalog";
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
      value: p.rating.toFixed(1),
      unit: <IconStar size={14} className="text-taxi" />,
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
      <article className={kids ? "kids" : undefined}>
        {/* En-tête produit */}
        <header className="mt-4 flex gap-4">
          <Thumb id={`hero-${p.slug}`} title={p.title} tone={p.tone} size={88} round={kids} />
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="text-[1.7rem] font-bold">{p.title}</h1>
            <p className="text-sm">
              {format(dict.product.by, { seller: p.seller })}
              {p.verified ? (
                <Badge tone="verified" icon={<IconCheck size={12} />} className="ml-2 align-middle">
                  {dict.product.verifiedSeller}
                </Badge>
              ) : null}
            </p>
            <p className="text-sm text-muted">
              {dict.product.kinds[p.kind]} · {dict.product.licenseValues[p.license]}
            </p>
          </div>
        </header>

        {/* Chiffres clés */}
        <dl className="mt-5 grid grid-cols-4 border-y-2 border-line py-3 text-center">
          {stats.map((s, i) => (
            <div key={i} className={i ? "border-l-2 border-line px-1" : "px-1"}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="flex items-center justify-center gap-1 text-[15px] font-bold">
                {s.value}
                {"unit" in s ? s.unit : null}
              </dd>
              <dd aria-hidden="true" className="text-xs text-muted">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>

        {p.platforms ? (
          <div className="mt-5">
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

        {/* Prix */}
        <div className="mt-5 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <Price usdCents={p.priceUsdCents} promoUsdCents={p.promoUsdCents} size="lg" {...priceProps} />
            {percent > 0 ? <Badge tone="promo">{format(dict.product.discount, { percent })}</Badge> : null}
          </div>
          {percent > 0 ? (
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <span>{dict.product.promoUntil}</span>
              <Countdown until="friday" label={dict.commerce.endsIn} endedLabel={dict.commerce.flashEnded} />
            </div>
          ) : null}
        </div>

        {/* Aperçus */}
        <section aria-labelledby="previews" className="mt-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 id="previews" className="text-xl font-bold">
              {dict.product.previews}
            </h2>
            <Badge>{dict.product.previewFree}</Badge>
          </div>
          {p.kind === "music" ? (
            <div className="flex items-center gap-3 bg-surface p-3">
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
              {(["ink", p.tone, "cendre"] as const).map((tone, i) => (
                <li key={i} className="w-32 shrink-0 overflow-hidden rounded-[var(--radius-ticket)]">
                  <span className="sr-only">{format(dict.product.previewItem, { n: i + 1, total: 3 })}</span>
                  <TicketCover
                    id={`prev-${p.slug}-${i}`}
                    tone={tone}
                    title={i === 0 ? p.title : `${i + 1} / 3`}
                    kids={kids}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Avantages */}
        <ul className="mt-6 flex flex-col">
          {perks(p, dict).map((perk) => (
            <li key={perk} className="flex min-h-12 items-center gap-3 border-b-2 border-line">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-fleuve text-paper">
                <IconCheck size={14} />
              </span>
              {perk}
            </li>
          ))}
        </ul>

        {/* Offrir / partager */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
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

        <KubaDivider id={`kuba-${p.slug}`} />

        <section aria-labelledby="about">
          <h2 id="about" className="text-xl font-bold">
            {dict.product.about}
          </h2>
          <p className="mt-2 max-w-prose leading-relaxed">{p.description}</p>
        </section>

        <section aria-labelledby="details" className="mt-6">
          <h2 id="details" className="text-xl font-bold">
            {dict.product.details}
          </h2>
          <dl className="mt-2">
            {infos.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b-2 border-line py-3 text-sm">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="reviews" className="mt-6">
          <h2 id="reviews" className="text-xl font-bold">
            {dict.product.reviewsTitle}
          </h2>
          <p className="mt-2 flex items-center gap-2">
            <IconStar size={18} className="text-taxi" />
            <span className="font-mono text-lg font-bold">{p.rating.toFixed(1)}</span>
            <span className="text-sm text-muted">{format(dict.product.reviews, { count: p.reviews })}</span>
          </p>
          <p className="mt-2 max-w-prose text-sm text-muted">{dict.product.reviewsEmpty}</p>
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
        price={<Price usdCents={p.priceUsdCents} promoUsdCents={p.promoUsdCents} {...priceProps} />}
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
