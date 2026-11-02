import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { ChipDemo, StampDemo, ToastDemo } from "@/components/design/Demos";
import { ProductTicket } from "@/components/shop/ProductTicket";
import {
  Badge,
  BottomNav,
  Button,
  Field,
  IconBolt,
  IconCheck,
  IconDiscover,
  IconLibrary,
  IconMe,
  IconSearch,
  KubaDivider,
  Price,
  Skeleton,
  Story,
  TicketSkeleton,
  Toast,
} from "@/components/ui";
import { Countdown } from "@/components/ui/Countdown";
import { PhoneField } from "@/components/ui/PhoneField";
import { Sheet } from "@/components/ui/Sheet";
import { ACCESSIBLE_VARIANTS, BRAND_COLORS } from "@/lib/brand";
import { DEMO_USD_TO_CDF_RATE } from "@/lib/currency";
import { DEMO_PRODUCTS } from "@/lib/demo/products";
import { format, getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";
import duotoneSample from "@/public/demo/marche.jpg";

export async function generateMetadata({ params }: PageProps<"/[locale]/design">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLocale(params));
  return { title: dict.design.title, robots: { index: false } };
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-12">
      <h2 id={id} className="mb-5 text-3xl font-bold">
        {title}
      </h2>
      {children}
    </section>
  );
}

const SWATCHES = [
  { key: "ink", hex: BRAND_COLORS.ink, className: "bg-ink text-paper" },
  { key: "paper", hex: BRAND_COLORS.paper, className: "bg-paper text-ink" },
  { key: "taxi", hex: BRAND_COLORS.taxi, className: "bg-taxi text-ink" },
  { key: "laterite", hex: BRAND_COLORS.laterite, className: "bg-laterite text-ink" },
  { key: "fleuve", hex: BRAND_COLORS.fleuve, className: "bg-fleuve text-paper" },
  { key: "cendre", hex: BRAND_COLORS.cendre, className: "bg-cendre text-ink" },
] as const;

export default async function DesignPage({ params }: PageProps<"/[locale]/design">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const d = dict.design;
  const byId = (id: string) => DEMO_PRODUCTS.find((p) => p.id === id)!;
  const [book, course, kidsApp, kidsAudio] = ["p1", "p3", "p5", "p8"].map(byId);

  return (
    <AppShell locale={locale} dict={dict} tab={null} path="design">
      <header className="pt-8">
        <h1 className="text-5xl font-bold">{d.title}</h1>
        <p className="mt-3 max-w-prose text-lg text-muted">{d.intro}</p>
      </header>

      <Section id="colors" title={d.sections.colors}>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SWATCHES.map((s) => (
            <li key={s.key} className="border-2 border-line">
              <div className={`flex h-24 items-end p-3 font-mono text-xl font-bold ${s.className}`}>
                {s.hex}
              </div>
              <p className="p-3 text-sm">{d.colorUsage[s.key]}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 font-mono text-xs text-muted">
          AA : {ACCESSIBLE_VARIANTS.lateriteStrong} · {ACCESSIBLE_VARIANTS.fleuveBright} ·{" "}
          {ACCESSIBLE_VARIANTS.cendreStrong}
        </p>
      </Section>

      <Section id="type" title={d.sections.type}>
        <div className="flex flex-col gap-4">
          <p className="font-display text-4xl font-bold">{d.typeSamples.display}</p>
          <p className="max-w-prose text-lg">{d.typeSamples.body}</p>
          <p className="font-mono text-lg">{d.typeSamples.mono} — TX-8F21-KIN</p>
        </div>
      </Section>

      <Section id="buttons" title={d.sections.buttons}>
        <div className="flex flex-col items-start gap-3">
          <Button size="lg" icon={<IconBolt size={20} />}>
            {dict.commerce.payMobileMoney}
          </Button>
          <p className="text-sm text-muted">{d.buttons.primary}</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary">{d.buttons.secondary}</Button>
            <Button variant="ghost">{d.buttons.ghost}</Button>
            <Button variant="danger">{d.buttons.deleteLabel}</Button>
            <Button disabled>{d.buttons.disabled}</Button>
            <Button loading loadingLabel={d.buttons.loading}>
              {dict.commerce.pay}
            </Button>
          </div>
        </div>
      </Section>

      <Section id="badges" title={d.sections.badges}>
        <div className="flex flex-wrap gap-2">
          <Badge tone="promo">{format(dict.product.discount, { percent: 30 })}</Badge>
          <Badge tone="flash" icon={<IconBolt size={12} />}>
            {dict.product.flash}
          </Badge>
          <Badge tone="new">{dict.product.new}</Badge>
          <Badge tone="success" icon={<IconCheck size={12} />}>
            {dict.commerce.delivered}
          </Badge>
          <Badge tone="verified" icon={<IconCheck size={12} />}>
            {dict.product.verifiedSeller}
          </Badge>
          <Badge>{dict.product.previewFree}</Badge>
        </div>
      </Section>

      <Section id="chips" title={d.sections.chips}>
        <ChipDemo labels={[d.chips.all, d.chips.books, d.chips.courses, d.chips.kids, d.chips.music]} />
      </Section>

      <Section id="fields" title={d.sections.fields}>
        <div className="grid max-w-md gap-5">
          <PhoneField
            id="design-phone"
            label={dict.field.phoneLabel}
            placeholder={dict.field.phonePlaceholder}
            hint={dict.field.phoneHint}
            detectedTemplate={dict.field.operatorDetected}
            unknownText={dict.field.operatorUnknown}
          />
          <Field
            id="design-name"
            label={d.fields.nameLabel}
            placeholder={d.fields.namePlaceholder}
            autoComplete="name"
          />
          <Field
            id="design-code"
            label={d.fields.codeLabel}
            defaultValue="KIN2026"
            mono
            error={d.fields.codeError}
          />
        </div>
      </Section>

      <Section id="tickets" title={d.sections.tickets}>
        <div className="flex flex-wrap gap-4">
          <ProductTicket product={book} locale={locale} dict={dict} />
          <ProductTicket product={course} locale={locale} dict={dict} currency="CDF" />
          <TicketSkeleton />
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <Price
            usdCents={699}
            promoUsdCents={499}
            currency="USD"
            rate={DEMO_USD_TO_CDF_RATE}
            locale={locale}
            oldPriceLabel={dict.product.oldPrice}
            size="lg"
          />
          <Price
            usdCents={699}
            promoUsdCents={499}
            currency="CDF"
            rate={DEMO_USD_TO_CDF_RATE}
            locale={locale}
            oldPriceLabel={dict.product.oldPrice}
            size="lg"
          />
        </div>
      </Section>

      <Section id="kids" title={d.sections.kids}>
        <p className="mb-4 text-muted">{d.kidsNote}</p>
        <div className="flex flex-wrap gap-4">
          <ProductTicket product={kidsApp} locale={locale} dict={dict} />
          <ProductTicket product={kidsAudio} locale={locale} dict={dict} />
        </div>
      </Section>

      <Section id="feedback" title={d.sections.feedback}>
        <div className="grid gap-8 sm:grid-cols-2">
          <ToastDemo
            trigger={d.toastDemo}
            success={dict.toast.paid}
            error={dict.toast.failed}
            closeLabel={dict.toast.close}
          />
          <StampDemo label={dict.commerce.delivered} replay={d.stampDemo} />
          <div className="flex flex-col items-start gap-3">
            <Countdown
              durationMs={75_000}
              label={dict.commerce.endsIn}
              endedLabel={dict.commerce.flashEnded}
            />
            <Toast tone="success">{dict.toast.paid}</Toast>
          </div>
        </div>
      </Section>

      <Section id="sheet" title={d.sections.sheet}>
        <Sheet triggerLabel={d.sheetDemo} title={d.sheetTitle} closeLabel={dict.sheet.close}>
          <p className="text-muted">{d.sheetBody}</p>
          <PhoneField
            id="sheet-phone"
            label={dict.field.phoneLabel}
            placeholder={dict.field.phonePlaceholder}
            hint={dict.field.phoneHint}
            detectedTemplate={dict.field.operatorDetected}
            unknownText={dict.field.operatorUnknown}
          />
          <Button size="lg" block>
            {dict.commerce.payMobileMoney}
          </Button>
        </Sheet>
      </Section>

      <Section id="skeleton" title={d.sections.skeleton}>
        <div className="flex max-w-md flex-col gap-2">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </Section>

      <Section id="nav" title={d.sections.nav}>
        <p className="mb-4 text-muted">{d.navNote}</p>
        <div className="max-w-md border-2 border-line">
          <BottomNav
            fixed={false}
            label={`${dict.a11y.mainNav} (${d.title})`}
            items={[
              { href: "#nav", label: dict.nav.discover, icon: <IconDiscover />, active: true },
              { href: "#nav", label: dict.nav.search, icon: <IconSearch /> },
              { href: "#nav", label: dict.nav.library, icon: <IconLibrary /> },
              { href: "#nav", label: dict.nav.me, icon: <IconMe /> },
            ]}
          />
        </div>
      </Section>

      <Section id="patterns" title={d.sections.patterns}>
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex gap-3">
            {DEMO_PRODUCTS.slice(0, 3).map((p, i) => (
              <Story key={p.id} title={p.title} tone={p.tone} seen={i === 2} />
            ))}
          </div>
          <figure className="w-60">
            <div className="duotone aspect-[4/3] w-full">
              <Image
                src={duotoneSample}
                alt=""
                sizes="240px"
                placeholder="blur"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-2 text-sm text-muted">{d.duotoneCaption}</figcaption>
          </figure>
        </div>
        <KubaDivider id="kuba-design" />
      </Section>
    </AppShell>
  );
}
