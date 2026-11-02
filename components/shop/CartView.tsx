"use client";

import Link from "next/link";
import { useState } from "react";
import { applyCoupon } from "@/lib/coupons";
import { effectivePrice, type ProductSummary } from "@/lib/catalog";
import { addToLibrary, cartStore, parentalStore, recordOrder, removeFromCart } from "@/lib/client/shop";
import { useStore } from "@/lib/client/store";
import type { Locale } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/format";
import { parsePhone } from "@/lib/operators";
import { Button, buttonClasses } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Field } from "@/components/ui/Field";
import { ListRow } from "@/components/ui/ListRow";
import { PhoneField } from "@/components/ui/PhoneField";
import { Money, Price } from "@/components/ui/Price";
import { Thumb } from "@/components/ui/Thumb";
import { IconBolt, IconClose, IconGift } from "@/components/ui/icons";
import { PaymentFlow, type PaymentLabels } from "./PaymentFlow";

export interface CartLabels {
  title: string;
  empty: string;
  emptyCta: string;
  remove: string;
  delivery: string;
  coupon: string;
  couponPlaceholder: string;
  couponApply: string;
  couponApplied: string;
  couponInvalid: string;
  couponRemove: string;
  couponHint: string;
  payWith: string;
  mobileMoney: string;
  mobileMoneyHint: string;
  card: string;
  cardHint: string;
  cardSoon: string;
  subtotal: string;
  discount: string;
  total: string;
  pay: string;
  getFree: string;
  secure: string;
  demoNotice: string;
  phoneInvalid: string;
  giftLine: string;
  free: string;
  oldPrice: string;
  phoneLabel: string;
  phonePlaceholder: string;
  phoneHint: string;
  detected: string;
  unknown: string;
  demo: string;
}

export function CartView({
  products,
  locale,
  exploreHref,
  libraryHref,
  labels: t,
  payment,
}: {
  products: Record<string, ProductSummary & { meta: string; href: string }>;
  locale: Locale;
  exploreHref: string;
  libraryHref: string;
  labels: CartLabels;
  payment: PaymentLabels;
}) {
  const cart = useStore(cartStore);
  const parental = useStore(parentalStore);
  const [method, setMethod] = useState<"mobile" | "card">("mobile");
  const [couponInput, setCouponInput] = useState("");
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string>();
  const [phoneValue, setPhoneValue] = useState("");
  const [phoneError, setPhoneError] = useState<string>();
  const [paying, setPaying] = useState(false);

  const lines = cart
    .map((line, index) => ({ line, index, product: products[line.slug] }))
    .filter((l) => l.product);
  const subtotal = lines.reduce((sum, l) => sum + effectivePrice(l.product), 0);
  const coupon = couponCode ? applyCoupon(couponCode, subtotal) : null;
  const discount = coupon?.ok ? coupon.discountUsdCents : 0;
  const total = subtotal - discount;
  const phone = parsePhone(phoneValue);
  const gifts = lines.flatMap((l) => (l.line.giftTo ? [l.line.giftTo] : []));

  const flow = paying ? (
    <PaymentFlow
      key="payment-flow"
      phone={phone}
      pin={parental.enabled ? parental.pin : null}
      total={<Money usdCents={total} locale={locale} />}
      count={lines.filter((l) => !l.line.giftTo).length}
      gifts={gifts.map((g) => parsePhone(g)?.display ?? g)}
      libraryHref={libraryHref}
      labels={payment}
      onSuccess={completeOrder}
      onClose={() => setPaying(false)}
    />
  ) : null;

  // Paiement réussi : le panier est vide, seul le dialogue reste affiché.
  // Même conteneur et même clé que le rendu complet : le dialogue n'est pas remonté.
  if (lines.length === 0 && paying) return <div className="flex flex-col gap-6">{flow}</div>;

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 bg-surface p-5">
        <p className="text-lg">{t.empty}</p>
        <Link href={exploreHref} className={buttonClasses({ variant: "secondary" })}>
          {t.emptyCta}
        </Link>
      </div>
    );
  }

  function completeOrder() {
    addToLibrary(
      lines
        .filter((l) => !l.line.giftTo)
        .map((l) => ({ slug: l.line.slug, paidUsdCents: effectivePrice(l.product) })),
    );
    recordOrder({ totalUsdCents: total, count: lines.length, giftTo: gifts });
    cartStore.set([]);
  }

  function pay() {
    if (total === 0) {
      completeOrder();
      window.location.assign(libraryHref);
      return;
    }
    if (!phone) {
      setPhoneError(t.phoneInvalid);
      return;
    }
    setPaying(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <section aria-label={t.title}>
        <ul>
          {lines.map(({ line, index, product: p }) => (
            <ListRow
              key={`${line.slug}-${line.giftTo ?? ""}`}
              href={p.href}
              media={
                <Thumb
                  id={`c-${index}`}
                  title={p.title}
                  tone={p.tone}
                  round={p.kind === "game" || p.kind === "edu"}
                />
              }
              title={p.title}
              meta={
                line.giftTo ? (
                  <span className="inline-flex items-center gap-1 text-fg">
                    <IconGift size={14} />
                    {format(t.giftLine, { phone: parsePhone(line.giftTo)?.display ?? line.giftTo })}
                  </span>
                ) : (
                  p.meta
                )
              }
              extra={
                <Price
                  usdCents={p.priceUsdCents}
                  promoUsdCents={p.promoUsdCents}
                  locale={locale}
                  oldPriceLabel={t.oldPrice}
                  freeLabel={t.free}
                />
              }
              action={
                <button
                  type="button"
                  onClick={() => removeFromCart(index)}
                  aria-label={format(t.remove, { title: p.title })}
                  className="grid size-11 place-items-center text-muted hover:text-fg"
                >
                  <IconClose size={18} />
                </button>
              }
            />
          ))}
        </ul>
        <p className="mt-2 text-sm text-muted">{t.delivery}</p>
      </section>

      {total > 0 || couponCode ? (
        <section aria-labelledby="coupon-title" className="flex flex-col gap-2">
          <h2 id="coupon-title" className="text-xl font-bold">
            {t.coupon}
          </h2>
          {coupon?.ok ? (
            <div className="flex items-center justify-between gap-3 border-2 border-fleuve px-3 py-2">
              <span className="font-mono">{format(t.couponApplied, { code: coupon.code })}</span>
              <button
                type="button"
                onClick={() => setCouponCode(null)}
                className="min-h-11 text-sm underline underline-offset-4"
              >
                {t.couponRemove}
              </button>
            </div>
          ) : (
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const r = applyCoupon(couponInput, subtotal);
                if (r.ok) {
                  setCouponCode(r.code);
                  setCouponError(undefined);
                } else setCouponError(t.couponInvalid);
              }}
            >
              <Field
                id="coupon"
                label={t.coupon}
                className="flex-1 [&>label]:sr-only"
                placeholder={t.couponPlaceholder}
                mono
                autoCapitalize="characters"
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value);
                  setCouponError(undefined);
                }}
                error={couponError}
              />
              <Button type="submit" variant="secondary" className={couponError ? "mb-7" : undefined}>
                {t.couponApply}
              </Button>
            </form>
          )}
          <p className="text-xs text-muted">
            <span className="mr-1 font-medium uppercase">{t.demo}</span>
            {t.couponHint}
          </p>
        </section>
      ) : null}

      {total > 0 ? (
        <section aria-labelledby="method-title" className="flex flex-col gap-3">
          <h2 id="method-title" className="text-xl font-bold">
            {t.payWith}
          </h2>
          <div role="radiogroup" aria-labelledby="method-title" className="grid gap-2">
            {(
              [
                ["mobile", t.mobileMoney, t.mobileMoneyHint],
                ["card", t.card, t.cardHint],
              ] as const
            ).map(([id, label, hint]) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={method === id}
                onClick={() => setMethod(id)}
                className={cn(
                  "flex min-h-14 items-center gap-3 border-2 px-3 text-left rounded-[var(--radius-control)]",
                  method === id ? "border-fg" : "border-line",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-5 shrink-0 rounded-full border-2",
                    method === id ? "border-[6px] border-fg" : "border-muted",
                  )}
                />
                <span className="flex flex-col">
                  <span className="font-medium">{label}</span>
                  <span className="text-sm text-muted">{hint}</span>
                </span>
              </button>
            ))}
          </div>
          {method === "mobile" ? (
            <PhoneField
              id="pay-phone"
              label={t.phoneLabel}
              placeholder={t.phonePlaceholder}
              hint={t.phoneHint}
              detectedTemplate={t.detected}
              unknownText={t.unknown}
              onValueChange={(v) => {
                setPhoneValue(v);
                setPhoneError(undefined);
              }}
              error={phoneError}
            />
          ) : (
            <p className="border-l-4 border-cendre bg-surface px-3 py-2 text-sm">{t.cardSoon}</p>
          )}
        </section>
      ) : null}

      <section className="flex flex-col gap-1 border-y-2 border-line py-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted">{t.subtotal}</span>
          <span className="font-mono">
            <Money usdCents={subtotal} locale={locale} />
          </span>
        </div>
        {discount ? (
          <div className="flex justify-between text-sm">
            <span className="text-muted">{t.discount}</span>
            <span className="font-mono text-success">
              −<Money usdCents={discount} locale={locale} />
            </span>
          </div>
        ) : null}
        <div className="flex justify-between text-lg font-bold">
          <span>{t.total}</span>
          <span className="font-mono">
            <Money usdCents={total} locale={locale} />
          </span>
        </div>
      </section>

      <div className="flex flex-col gap-2">
        <Button
          size="lg"
          block
          onClick={pay}
          disabled={total > 0 && method === "card"}
          icon={<IconBolt size={20} />}
        >
          {total > 0 ? (
            <>
              {t.pay} <span className="font-mono">{<Money usdCents={total} locale={locale} />}</span>
            </>
          ) : (
            t.getFree
          )}
        </Button>
        <p className="text-center text-xs text-muted">{t.secure}</p>
        {total > 0 ? <p className="bg-surface px-3 py-2 text-xs text-muted">{t.demoNotice}</p> : null}
      </div>

      {flow}
    </div>
  );
}
