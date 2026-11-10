import { formatMoney, usdCentsToCdf, DEMO_USD_TO_CDF_RATE, type Currency } from "@/lib/currency";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "./cn";

/**
 * Prix : montant en gras, ancien prix barré en gris (maquette).
 * Sans `currency`, les deux devises sont rendues et le CSS affiche celle choisie
 * (attribut data-currency de <html>) : bascule USD / FC sans JavaScript.
 */
export function Price({
  usdCents,
  promoUsdCents,
  currency,
  rate = DEMO_USD_TO_CDF_RATE,
  locale,
  oldPriceLabel,
  freeLabel,
  size = "md",
  className,
}: {
  usdCents: number;
  promoUsdCents?: number;
  currency?: Currency;
  rate?: number;
  locale: Locale;
  oldPriceLabel: string;
  /** Texte affiché pour un prix nul (« Gratuit »). */
  freeLabel?: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const hasPromo = promoUsdCents !== undefined && promoUsdCents < usdCents;
  const current = hasPromo ? promoUsdCents : usdCents;

  if (current === 0 && freeLabel) {
    return (
      <span
        className={cn(
          "font-display font-bold text-success",
          size === "lg" ? "text-[26px]" : "text-sm",
          className,
        )}
      >
        {freeLabel}
      </span>
    );
  }

  const render = (c: Currency) => {
    const fmt = (cents: number) =>
      c === "USD"
        ? formatMoney(cents, "USD", locale)
        : formatMoney(usdCentsToCdf(cents, rate), "CDF", locale);
    return (
      <>
        <span className="price-tag">{fmt(current)}</span>
        {hasPromo ? (
          <s className="price-old">
            <span className="sr-only">{oldPriceLabel} </span>
            {fmt(usdCents)}
          </s>
        ) : null}
      </>
    );
  };

  return (
    <span className={cn("price", size === "lg" && "price-lg", className)}>
      {currency ? (
        render(currency)
      ) : (
        <>
          <span className="cur-usd">{render("USD")}</span>
          <span className="cur-cdf">{render("CDF")}</span>
        </>
      )}
    </span>
  );
}

/** Montant simple (totaux du panier), dans les deux devises. */
export function Money({
  usdCents,
  locale,
  rate = DEMO_USD_TO_CDF_RATE,
}: {
  usdCents: number;
  locale: Locale;
  rate?: number;
}) {
  return (
    <>
      <span className="cur-usd">{formatMoney(usdCents, "USD", locale)}</span>
      <span className="cur-cdf">{formatMoney(usdCentsToCdf(usdCents, rate), "CDF", locale)}</span>
    </>
  );
}
