import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { ChipDemo, SegmentedDemo, StampDemo, SwitchDemo, ToastDemo } from "@/components/design/Demos";
import { metaLine } from "@/components/shop/labels";
import { PreviewButton } from "@/components/shop/PreviewButton";
import { ProductTicket } from "@/components/shop/ProductTicket";
import {
  Badge,
  BottomNav,
  Button,
  CategoryIcon,
  Field,
  IconBolt,
  IconCart,
  IconCheck,
  IconGrid,
  IconHome,
  IconMe,
  IconPlus,
  ListRow,
  Logo,
  Price,
  Rating,
  RowSkeleton,
  SearchField,
  Thumb,
  TicketSkeleton,
  Toast,
} from "@/components/ui";
import { Countdown } from "@/components/ui/Countdown";
import { CurrencyToggle } from "@/components/ui/CurrencyToggle";
import { PhoneField } from "@/components/ui/PhoneField";
import { Sheet } from "@/components/ui/Sheet";
import { categoryOf, getProduct } from "@/lib/catalog";
import { format, getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";
import { CATEGORY_IDS, COLORS } from "@/lib/theme";

export async function generateMetadata({ params }: PageProps<"/[locale]/design">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLocale(params));
  return { title: dict.design.title, robots: { index: false } };
}

function Section({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-8">
      <h2 id={id} className="text-lg font-bold">
        {title}
      </h2>
      {note ? <p className="mt-1 text-sm text-muted">{note}</p> : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** Pastille de couleur : la classe Tailwind vient du token (aucune couleur en dur). */
const SWATCH: Record<keyof typeof COLORS, string> = {
  primary: "bg-primary text-on-primary",
  primaryPressed: "bg-primary-pressed text-on-primary",
  background: "bg-background text-fg border border-line",
  surface: "bg-surface text-fg",
  surfaceHigh: "bg-surface-high text-fg",
  border: "bg-border text-fg",
  primaryText: "bg-primary-text text-on-accent",
  textPrimary: "bg-text-primary text-on-accent",
  textSecondary: "bg-text-secondary text-on-accent",
  onPrimary: "bg-on-primary text-on-accent",
  onAccent: "bg-on-accent text-fg border border-line",
  night: "bg-night text-on-accent",
  champagne: "bg-champagne text-night",
  gold: "bg-gold text-on-accent",
  goldSoft: "bg-gold-soft text-gold",
  terre: "bg-terre text-on-accent",
  terreSoft: "bg-terre-soft text-terre-deep",
  terreDeep: "bg-terre-deep text-on-accent",
  urgent: "bg-urgent text-fg",
  urgentSoft: "bg-urgent-soft text-urgent-text",
  urgentText: "bg-urgent-text text-on-accent",
  star: "bg-star text-on-accent",
  success: "bg-success text-on-accent",
  successSoft: "bg-success-soft text-success",
};
const BASE = [
  "primary",
  "primaryPressed",
  "primaryText",
  "background",
  "surface",
  "surfaceHigh",
  "border",
  "textPrimary",
  "textSecondary",
  "onPrimary",
  "onAccent",
] as const;
const MARKETING = [
  "night",
  "champagne",
  "gold",
  "goldSoft",
  "terre",
  "terreSoft",
  "terreDeep",
  "urgent",
  "urgentSoft",
  "urgentText",
  "star",
  "success",
  "successSoft",
] as const;

export default async function DesignPage({ params }: PageProps<"/[locale]/design">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const d = dict.design;
  const usage = d.usage as Record<string, string>;
  const [book, app, track, image, free] = [
    "kinshasa-mode-emploi",
    "maths-en-s-amusant",
    "rumba-douce",
    "pack-20-fonds-d-ecran",
    "les-lettres-en-couleurs",
  ].map((slug) => getProduct(slug)!);
  const priceProps = { locale, oldPriceLabel: dict.product.oldPrice, freeLabel: dict.product.free };

  return (
    <AppShell locale={locale} dict={dict} tab={null} path="design">
      <header className="pt-1">
        <h1 className="text-[28px] font-extrabold">{d.title}</h1>
        <p className="mt-1 max-w-prose text-sm text-muted">{d.intro}</p>
      </header>

      <Section id="logo" title={d.logo}>
        <div className="card flex items-center justify-center p-6">
          <Logo size="lg" />
        </div>
      </Section>

      <Section id="colors" title={d.colorsBase}>
        <ul className="grid grid-cols-3 gap-2">
          {BASE.map((k) => (
            <li key={k} className="card overflow-hidden">
              <div className={`flex h-14 items-end p-2 text-[11px] font-bold uppercase ${SWATCH[k]}`}>
                {COLORS[k]}
              </div>
              <p className="p-2 text-[11px] leading-tight">
                <span className="font-semibold">{k}</span>
                <br />
                <span className="text-muted">{usage[k]}</span>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="marketing" title={d.colorsMarketing}>
        <ul className="grid grid-cols-2 gap-2">
          {MARKETING.map((k) => (
            <li key={k} className="card flex items-center gap-3 p-2">
              <span
                className={`grid size-11 shrink-0 place-items-center rounded-[var(--radius-sm)] text-[10px] font-bold ${SWATCH[k]}`}
              >
                {COLORS[k].slice(1)}
              </span>
              <span className="text-[11px] leading-tight">
                <span className="font-semibold">{k}</span>
                <br />
                <span className="text-muted">{usage[k]}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="categories" title={d.colorsCategories}>
        <ul className="grid grid-cols-2 gap-2">
          {CATEGORY_IDS.map((c) => (
            <li key={c} className="card flex items-center gap-3 overflow-hidden p-2">
              <span className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-surface-2 text-muted">
                <CategoryIcon id={c} />
              </span>
              <span className="text-sm font-medium">{dict.categories[c]}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="type" title={d.sections.type}>
        <div className="card flex flex-col gap-3 p-4">
          <p className="font-display text-[26px] font-extrabold leading-tight">
            {d.typeSamples.display.replace("Inter 700", "Plus Jakarta Sans 800")}
          </p>
          <p className="text-[15px]">{d.typeSamples.body.replace("Inter 400", "DM Sans 400")}</p>
          <div className="flex items-baseline gap-3">
            <Price usdCents={2999} promoUsdCents={1999} size="lg" {...priceProps} />
            <span className="text-xs text-muted">{d.priceSample}</span>
          </div>
        </div>
      </Section>

      <Section id="buttons" title={d.sections.buttons} note={d.oneGreen}>
        <div className="card flex flex-col gap-3 p-4">
          <Button size="lg" block haptic icon={<IconBolt size={18} />}>
            {dict.product.buyNow}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" icon={<IconCart size={18} />}>
              {dict.commerce.addToCart}
            </Button>
            <Button variant="ghost">{d.link}</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="danger" size="sm">
              {d.buttons.deleteLabel}
            </Button>
            <Button variant="outline" size="sm" disabled>
              {d.buttons.disabled}
            </Button>
            <Button variant="outline" size="sm" loading loadingLabel={d.buttons.loading}>
              {dict.commerce.pay}
            </Button>
          </div>
          <p className="text-xs text-muted">{d.haptic}</p>
        </div>
      </Section>

      <Section id="badges" title={d.sections.badges}>
        <div className="flex flex-wrap gap-2">
          <Badge tone="promo">{format(dict.product.discount, { percent: 30 })}</Badge>
          <Badge tone="flash" icon={<IconBolt size={11} />}>
            {dict.product.flash}
          </Badge>
          <Badge tone="urgent">{format(dict.badges.lowStock, { count: 3 })}</Badge>
          <Badge tone="urgent">{format(dict.badges.deadline, { days: 2 })}</Badge>
          <Badge tone="trust">{dict.product.new}</Badge>
          <Badge tone="premium">{dict.badges.sponsored}</Badge>
          <Badge tone="premium">{dict.badges.bestSeller}</Badge>
          <Badge tone="success" icon={<IconCheck size={11} />}>
            {dict.commerce.delivered}
          </Badge>
          <Badge tone="verified" icon={<IconCheck size={12} />}>
            {format(dict.badges.verifiedSince, { year: 2023 })}
          </Badge>
        </div>
      </Section>

      <Section id="chips" title={d.sections.chips}>
        <ChipDemo labels={[dict.explore.all, ...CATEGORY_IDS.slice(0, 5).map((c) => dict.categories[c])]} />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <CurrencyToggle label={dict.header.currency} />
          <SegmentedDemo
            label={dict.explore.priceLabel}
            options={[dict.explore.price.all, dict.explore.price.free, dict.explore.price.paid]}
          />
          <SwitchDemo label={dict.account.parental} />
        </div>
      </Section>

      <Section id="fields" title={d.sections.fields}>
        <div className="flex flex-col gap-4">
          <SearchField
            action="#fields"
            label={dict.search.label}
            placeholder={dict.search.placeholder}
            submitLabel={dict.search.submit}
          />
          <PhoneField
            id="design-phone"
            label={dict.field.phoneLabel}
            placeholder={dict.field.phonePlaceholder}
            hint={dict.field.phoneHint}
            detectedTemplate={dict.field.operatorDetected}
            unknownText={dict.field.operatorUnknown}
          />
          <Field
            id="design-code"
            label={d.fields.codeLabel}
            defaultValue="KIN2026"
            error={d.fields.codeError}
          />
        </div>
      </Section>

      <Section id="cards" title={d.cards}>
        <div className="grid grid-cols-2 gap-2">
          <ProductTicket product={book} locale={locale} dict={dict} quickAdd />
          <ProductTicket product={app} locale={locale} dict={dict} flash />
          <ProductTicket product={image} locale={locale} dict={dict} quickAdd />
          <ProductTicket product={free} locale={locale} dict={dict} quickAdd />
        </div>
        <ul className="card mt-3">
          <ListRow
            href="#cards"
            media={<Thumb title={app.title} category={categoryOf(app.kind)} round />}
            title={app.title}
            meta={metaLine(app, dict)}
            extra={
              <Rating
                value={app.rating}
                count={String(app.reviews)}
                locale={locale}
                label={format(dict.product.rating, { rating: app.rating })}
              />
            }
            action={<Price usdCents={app.priceUsdCents} promoUsdCents={app.promoUsdCents} {...priceProps} />}
          />
          <ListRow
            lead={
              <PreviewButton
                id={track.slug}
                title={track.title}
                playLabel={format(dict.product.listen, { title: track.title })}
                pauseLabel={dict.product.pause}
              />
            }
            title={track.title}
            meta={metaLine(track, dict)}
            action={<Price usdCents={track.priceUsdCents} {...priceProps} />}
          />
        </ul>
      </Section>

      <Section id="feedback" title={d.sections.feedback}>
        <div className="flex flex-col gap-4">
          <Countdown durationMs={75_000} label={dict.commerce.endsIn} endedLabel={dict.commerce.flashEnded} />
          <Toast tone="success">{dict.toast.paid}</Toast>
          <ToastDemo
            trigger={d.toastDemo}
            success={dict.toast.paid}
            error={dict.toast.failed}
            closeLabel={dict.toast.close}
          />
          <StampDemo label={dict.commerce.delivered} replay={d.stampDemo} />
          <Sheet triggerLabel={d.sheetDemo} title={d.sheetTitle} closeLabel={dict.sheet.close}>
            <p className="text-sm text-muted">{d.sheetBody}</p>
            <Button size="lg" block haptic>
              {dict.commerce.payMobileMoney}
            </Button>
          </Sheet>
        </div>
      </Section>

      <Section id="skeletons" title={d.skeletons}>
        <div className="grid grid-cols-2 gap-2">
          <TicketSkeleton />
          <TicketSkeleton />
        </div>
        <div className="card mt-3">
          <RowSkeleton />
          <RowSkeleton />
        </div>
      </Section>

      <Section id="nav" title={d.newNav}>
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line">
          <BottomNav
            fixed={false}
            label={`${dict.a11y.mainNav} (${d.title})`}
            items={[
              { href: "#nav", label: dict.nav.home, icon: <IconHome />, active: true },
              { href: "#categories", label: dict.nav.categories, icon: <IconGrid /> },
              { href: "#buttons", label: dict.nav.sell, icon: <IconPlus /> },
              {
                href: "#cards",
                label: dict.nav.cart,
                icon: <IconCart />,
                badge: (
                  <span className="absolute -right-2 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[11px] font-bold leading-none text-on-primary">
                    2
                  </span>
                ),
              },
              { href: "#fields", label: dict.nav.account, icon: <IconMe /> },
            ]}
          />
        </div>
      </Section>
    </AppShell>
  );
}
