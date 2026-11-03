import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { DeadlineBadge } from "@/components/listings/DeadlineBadge";
import {
  AlertSwitch,
  ApplySheet,
  SaveButton,
  SubmitSheet,
  VisitSheet,
} from "@/components/listings/ListingActions";
import { ListingTicket } from "@/components/listings/ListingTicket";
import { RentPrice } from "@/components/listings/RentPrice";
import { listingAmount, listingKind, usd } from "@/components/listings/text";
import { ContactLink, ReportSheet, ShareSheet, TrackRecent } from "@/components/shop/CommonActions";
import { FavoriteButton } from "@/components/shop/FavoriteButton";
import { MobileMoneyPay } from "@/components/shop/MobileMoneyPay";
import { PreviewGallery } from "@/components/shop/PreviewGallery";
import { SoonButton } from "@/components/shop/SoonButton";
import {
  Badge,
  CategoryIcon,
  IconCheck,
  IconDownload,
  IconMapPin,
  IconMessage,
  IconPlay,
  Money,
  buttonClasses,
} from "@/components/ui";
import { Countdown } from "@/components/ui/Countdown";
import { SUPPORT_WHATSAPP } from "@/lib/brand";
import { CATEGORY_SLUGS } from "@/lib/categories";
import { localePath } from "@/lib/i18n/config";
import { formatDate } from "@/lib/i18n/dates";
import { format, getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";
import { LISTINGS, URGENT_DAYS, getListing, listingsIn } from "@/lib/listings";

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ slug: l.slug }));
}

async function load(params: Promise<{ locale: string; slug: string }>) {
  const locale = await resolveLocale(params);
  const listing = getListing((await params).slug);
  if (!listing) notFound();
  return { locale, l: listing, dict: await getDictionary(locale) };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/annonce/[slug]">): Promise<Metadata> {
  const { l } = await load(params);
  return { title: l.title, description: l.description };
}

const wa = (text: string) => `${SUPPORT_WHATSAPP.href}?text=${encodeURIComponent(text)}`;

export default async function ListingPage({ params }: PageProps<"/[locale]/annonce/[slug]">) {
  const { locale, l, dict } = await load(params);
  const t = dict.listing;
  const a = dict.actions;
  const base = localePath(locale);
  const path = `annonce/${l.slug}`;
  const activityHref = `${localePath(locale, "compte")}#activites`;
  const common = {
    slug: l.slug,
    title: l.title,
    t,
    field: dict.field,
    closeLabel: dict.sheet.close,
    activityHref,
    invalidPhone: dict.cart.phoneInvalid,
  };
  const similar = listingsIn(l.category).filter((x) => x.slug !== l.slug);
  const payment = { ...dict.payment, delivered: t.stamps.paid, flashEnded: dict.commerce.flashEnded };

  const infos: [string, string][] =
    l.category === "realestate"
      ? [
          [t.infos.type, t.types[l.type]],
          [t.infos.location, `${l.quartier}, ${l.commune}`],
          ...(l.bedrooms ? [[t.infos.bedrooms, String(l.bedrooms)] as [string, string]] : []),
          [t.infos.furnished, l.furnished ? t.furnished : t.unfurnished],
          [t.infos.area, format(t.area, { area: l.areaM2 })],
          [
            t.infos.availability,
            l.availableFrom
              ? format(t.availableFrom, { date: formatDate(l.availableFrom, locale) })
              : t.availableNow,
          ],
          [t.infos.deposit, l.depositMonths ? format(t.deposit, { months: l.depositMonths }) : t.depositHall],
        ]
      : l.category === "jobs"
        ? [
            [t.infos.sector, l.sector],
            [t.infos.contract, t.contracts[l.contract]],
            [t.infos.mode, `${t.modes[l.mode]} · ${l.commune}`],
            [t.infos.salary, listingAmount(l, dict) ?? ""],
            [t.infos.deadline, format(t.deadline, { days: l.deadlineDays })],
          ]
        : [
            [t.infos.organization, l.publisher],
            [t.infos.reference, l.reference],
            [t.infos.sector, l.sector],
            [t.infos.budget, listingAmount(l, dict) ?? ""],
            [t.infos.deadline, format(t.deadline, { days: l.deadlineDays })],
          ];
  const deposit = l.category === "realestate" ? l.priceUsdCents * Math.max(1, l.depositMonths) : 0;
  const mapHref =
    l.category === "realestate"
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${l.quartier}, ${l.commune}, Kinshasa`)}`
      : null;

  return (
    <AppShell
      locale={locale}
      dict={dict}
      tab={null}
      path={path}
      back={localePath(locale, `categories/${CATEGORY_SLUGS[l.category]}`)}
      hideNav
    >
      <TrackRecent id={`a:${l.slug}`} />
      <article className="flex flex-col gap-2.5">
        {l.category === "realestate" ? (
          <section aria-labelledby="photos" className="-mx-3 -mt-3">
            <h2 id="photos" className="sr-only">
              {t.sections.photos}
            </h2>
            <PreviewGallery
              category="realestate"
              slides={Array.from({ length: l.photos }, (_, i) => `${t.types[l.type]} · ${i + 1}/${l.photos}`)}
              labels={{
                open: dict.gallery.open,
                prev: dict.gallery.prev,
                next: dict.gallery.next,
                close: dict.sheet.close,
                counter: dict.product.previewItem,
              }}
            />
          </section>
        ) : null}

        <section className="card flex flex-col gap-2 p-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral" icon={<CategoryIcon id={l.category} size={12} />}>
              {listingKind(l, dict)}
            </Badge>
            {l.category !== "realestate" ? <DeadlineBadge days={l.deadlineDays} label={t.deadline} /> : null}
          </div>
          {l.category === "realestate" ? (
            <RentPrice
              usdCents={l.priceUsdCents}
              template={l.unit === "month" ? t.perMonth : t.perDay}
              locale={locale}
              large
            />
          ) : (
            <p className="font-display text-[22px] font-extrabold tabular-nums">{listingAmount(l, dict)}</p>
          )}
          <h1 className="text-[17px] leading-snug font-semibold">{l.title}</h1>
          <p className="text-[13px] text-muted">
            {format(t.posted, { days: l.postedDaysAgo })} · {format(t.views, { count: usd(l.views) })}
          </p>
          {l.category !== "realestate" && l.deadlineDays <= URGENT_DAYS ? (
            <Countdown
              durationMs={l.deadlineDays * 86_400_000}
              label={t.infos.deadline}
              endedLabel={t.deadlineClosed}
            />
          ) : null}
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-line pt-2 text-sm">
            <span className="font-semibold">{l.publisher}</span>
            {l.verified ? (
              <Badge tone="verified" icon={<IconCheck size={12} />}>
                {t.verified}
              </Badge>
            ) : null}
            <span className="text-xs text-muted">{format(t.since, { year: l.since })}</span>
          </p>
        </section>

        {/* Actions propres à la catégorie */}
        <section className="card flex flex-col gap-2 p-3.5">
          {l.category === "realestate" ? (
            <>
              <div className="flex flex-wrap gap-2">
                <MobileMoneyPay
                  id={l.slug}
                  amount={<Money usdCents={deposit} locale={locale} />}
                  payment={payment}
                  doneHref={activityHref}
                  className="flex-1"
                  texts={{
                    trigger: l.depositMonths ? t.payDeposit : t.payAdvance,
                    title: t.depositTitle,
                    intro: format(t.depositIntro, { amount: `${usd(deposit / 100)} $` }),
                    pay: format(t.depositPay, { amount: `${usd(deposit / 100)} $` }),
                    successTitle: t.depositSuccess,
                    successBody: t.depositBody,
                    doneLabel: t.goActivities,
                    phoneLabel: dict.field.phoneLabel,
                    phonePlaceholder: dict.field.phonePlaceholder,
                    phoneHint: dict.field.phoneHint,
                    detected: dict.field.operatorDetected,
                    unknown: dict.field.operatorUnknown,
                    invalid: dict.cart.phoneInvalid,
                    close: dict.sheet.close,
                  }}
                  activity={{
                    kind: "deposit",
                    slug: l.slug,
                    title: l.title,
                    status: "paid",
                    detail: `${usd(deposit / 100)} $`,
                  }}
                />
                <SoonButton
                  label={t.video}
                  soon={dict.feedback.soon}
                  icon={<IconPlay size={18} />}
                  className="flex-1"
                />
              </div>
              {mapHref ? (
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener"
                  className={buttonClasses({ variant: "outline", block: true })}
                >
                  <IconMapPin size={18} />
                  {t.map}
                </a>
              ) : null}
              <AlertSwitch category="realestate" label={t.alert} on={t.alertOn} off={t.alertOff} />
            </>
          ) : null}
          {l.category === "jobs" ? (
            <>
              <SaveButton
                slug={l.slug}
                label={t.save}
                savedLabel={t.saved}
                savedMsg={t.saved}
                removedMsg={t.unsaved}
              />
              <AlertSwitch category="jobs" label={t.alertJobs} on={t.alertOn} off={t.alertOff} />
            </>
          ) : null}
          {l.category === "tenders" ? (
            <>
              <Link
                href={`${base}/${path}/cahier`}
                className={buttonClasses({ variant: "outline", block: true })}
              >
                <IconDownload size={18} />
                {t.specsOpen}
              </Link>
              <AlertSwitch category="tenders" label={t.alert} on={t.alertOn} off={t.alertOff} />
            </>
          ) : null}
          <div className="-mx-1 flex flex-wrap items-center gap-1 border-t border-line pt-2">
            {l.category !== "jobs" ? (
              <FavoriteButton
                slug={l.slug}
                addLabel={dict.product.favorite}
                removeLabel={dict.product.unfavorite}
              />
            ) : null}
            <ShareSheet
              path={`${base}/${path}/`}
              text={format(dict.product.shareText, { title: l.title })}
              t={a}
              closeLabel={dict.sheet.close}
            />
            <ContactLink href={wa(format(t.whatsappText, { title: l.title }))} label={t.contact} />
            <ReportSheet slug={l.slug} t={a} closeLabel={dict.sheet.close} />
          </div>
        </section>

        <section aria-labelledby="details" className="card px-3.5 pb-1 pt-3">
          <h2 id="details" className="text-base font-bold">
            {t.sections.details}
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

        <section aria-labelledby="desc" className="card flex flex-col gap-2 p-3.5">
          <h2 id="desc" className="text-base font-bold">
            {t.sections.description}
          </h2>
          <p className="text-sm leading-relaxed">{l.description}</p>
          {l.category === "jobs" || l.category === "tenders" ? (
            <>
              <h3 className="mt-2 text-sm font-bold">
                {l.category === "jobs" ? t.sections.requirements : t.sections.documents}
              </h3>
              <ul className="flex flex-col gap-1.5">
                {(l.category === "jobs" ? l.requirements : l.documents).map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm">
                    <IconCheck size={16} className="mt-0.5 shrink-0 text-success" />
                    {r}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {l.category === "realestate" ? (
            <p className="mt-1 flex items-center gap-2 text-sm text-muted">
              <IconMapPin size={16} />
              {l.quartier}, {l.commune}
            </p>
          ) : null}
        </section>
      </article>

      {similar.length ? (
        <section aria-labelledby="similar" className="mt-4">
          <h2 id="similar" className="mb-2 px-1 text-[17px] font-bold">
            {t.sections.similar}
          </h2>
          <div className="scroll-rail -mx-3 flex gap-2.5 overflow-x-auto px-3">
            {similar.map((s) => (
              <ListingTicket key={s.slug} listing={s} locale={locale} dict={dict} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Barre d'action fixe */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2.5">
        <div className="mx-auto flex max-w-5xl gap-2">
          {l.category === "realestate" ? (
            <>
              <a
                href={wa(format(t.whatsappText, { title: l.title }))}
                target="_blank"
                rel="noopener"
                className={buttonClasses({ variant: "outline", className: "flex-1" })}
              >
                <IconMessage size={18} />
                {t.whatsapp}
              </a>
              <VisitSheet {...common} />
            </>
          ) : null}
          {l.category === "jobs" ? (
            <>
              <ApplySheet {...common} publisher={l.publisher} mode="cv" />
              <ApplySheet {...common} publisher={l.publisher} mode="application" />
            </>
          ) : null}
          {l.category === "tenders" ? (
            <>
              <a
                href={wa(format(t.askText, { ref: l.reference, title: l.title }))}
                target="_blank"
                rel="noopener"
                className={buttonClasses({ variant: "outline", className: "flex-1" })}
              >
                <IconMessage size={18} />
                {t.ask}
              </a>
              <SubmitSheet {...common} reference={l.reference} documents={l.documents} />
            </>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
