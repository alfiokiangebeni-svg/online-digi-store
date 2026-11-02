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
import { PhoneField } from "@/components/ui/PhoneField";
import { Money, Price } from "@/components/ui/Price";
import { Thumb } from "@/components/ui/Thumb";
import { IconDownload, IconGift } from "@/components/ui/icons";
import { PaymentFlow, type PaymentLabels } from "./PaymentFlow";

export interface CartLabels {
  title: string;
  empty: string;
  emptyCta: string;
  remove: string;
  removeShort: string;
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
  andDownload: string;
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
  if (lines.length === 0 && paying) return <div className="flex flex-col gap-3">{flow}</div>;

  if (lines.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-3 px-4 py-8 text-center">
        <p className="text-[15px] font-semibold">{t.empty}</p>
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
      document.getElementById("pay-phone")?.focus();
      return;
    }
    setPaying(true);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Articles */}
      <section aria-label={t.title} className="card overflow-hidden">
        <ul>
          {lines.map(({ line, index, product: p }) => (
            <li
              key={`${line.slug}-${line.giftTo ?? ""}`}
              className="flex items-center gap-3 border-b border-surface-2 p-3.5"
            >
              <Thumb title={p.title} tone={p.tone} round={p.kind === "game" || p.kind === "edu"} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <Link href={p.href} prefetch={false} className="truncate text-sm font-semibold">
                  {p.title}
                </Link>
                <span className="truncate text-xs text-muted">
                  {line.giftTo ? (
                    <span className="inline-flex items-center gap-1 text-fg">
                      <IconGift size={13} />
                      {format(t.giftLine, { phone: parsePhone(line.giftTo)?.display ?? line.giftTo })}
                    </span>
                  ) : (
                    p.meta
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => removeFromCart(index)}
                  aria-label={format(t.remove, { title: p.title })}
                  className="self-start py-1 text-xs text-muted underline underline-offset-2 hover:text-fg"
                >
                  {t.removeShort}
                </button>
              </div>
              <Price
                usdCents={p.priceUsdCents}
                promoUsdCents={p.promoUsdCents}
                locale={locale}
                oldPriceLabel={t.oldPrice}
                freeLabel={t.free}
                className="flex-col items-end"
              />
            </li>
          ))}
        </ul>
        <p className="flex items-center gap-2.5 bg-mint px-3.5 py-3 text-xs text-leaf-strong dark:bg-surface-2 dark:text-success">
          <IconDownload size={16} />
          {t.delivery}
        </p>
      </section>

      {/* Code promo */}
      {total > 0 || couponCode ? (
        <section aria-labelledby="coupon-title" className="card flex flex-col gap-2.5 p-3.5">
          <h2 id="coupon-title" className="text-[15px] font-bold">
            {t.coupon}
          </h2>
          {coupon?.ok ? (
            <div className="flex items-center justify-between gap-3 rounded-[6px] bg-mint px-3 py-2.5 text-sm text-leaf-strong dark:bg-surface-2 dark:text-success">
              <span className="font-semibold">{format(t.couponApplied, { code: coupon.code })}</span>
              <button
                type="button"
                onClick={() => setCouponCode(null)}
                className="min-h-9 text-xs underline underline-offset-2"
              >
                {t.couponRemove}
              </button>
            </div>
          ) : (
            <form
              className="flex items-start gap-2"
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
                autoCapitalize="characters"
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value);
                  setCouponError(undefined);
                }}
                error={couponError}
              />
              <Button type="submit" variant="secondary">
                {t.couponApply}
              </Button>
            </form>
          )}
          <p className="text-[11px] text-muted">
            <span className="mr-1 font-semibold uppercase">{t.demo}</span>
            {t.couponHint}
          </p>
        </section>
      ) : null}

      {/* Moyen de paiement */}
      {total > 0 ? (
        <section aria-labelledby="method-title" className="card px-3.5 pb-1 pt-3.5">
          <h2 id="method-title" className="mb-1 text-[15px] font-bold">
            {t.payWith}
          </h2>
          <div role="radiogroup" aria-labelledby="method-title">
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
                className="flex min-h-14 w-full items-center gap-3 border-b border-surface-2 text-left"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-5 shrink-0 rounded-full",
                    method === id ? "border-[6px] border-fg" : "border-[1.5px] border-hint",
                  )}
                />
                <span className="flex flex-col">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-xs text-muted">{hint}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="py-3">
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
              <p className="text-sm text-muted">{t.cardSoon}</p>
            )}
          </div>
        </section>
      ) : null}

      {/* Totaux */}
      <section className="card flex flex-col gap-2 p-3.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">{t.subtotal}</span>
          <Money usdCents={subtotal} locale={locale} />
        </div>
        {discount ? (
          <div className="flex justify-between">
            <span className="text-muted">{t.discount}</span>
            <span className="text-promo">
              −<Money usdCents={discount} locale={locale} />
            </span>
          </div>
        ) : null}
        <div className="flex justify-between border-t border-surface-2 pt-2 text-base font-bold">
          <span>{t.total}</span>
          <Money usdCents={total} locale={locale} />
        </div>
      </section>

      {total > 0 ? <p className="px-1 text-[11px] leading-relaxed text-muted">{t.demoNotice}</p> : null}

      {/* Barre de paiement fixe */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e5e7eb] bg-surface px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2.5 dark:border-line">
        <div className="mx-auto flex max-w-xl flex-col gap-1.5">
          <Button size="lg" block onClick={pay} disabled={total > 0 && method === "card"}>
            {total > 0 ? (
              <>
                {t.pay} <Money usdCents={total} locale={locale} /> {t.andDownload}
              </>
            ) : (
              t.getFree
            )}
          </Button>
          <p className="text-center text-[11px] text-muted">{t.secure}</p>
        </div>
      </div>

      {flow}
    </div>
  );
}
