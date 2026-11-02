import { formatMoney, usdCentsToCdf, type Currency } from "@/lib/currency";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "./cn";

/**
 * Prix : étiquette jaune taxi, chiffres en Space Mono.
 * Le prix de référence est en cents USD ; le CDF est calculé au taux du jour.
 */
export function Price({
  usdCents,
  promoUsdCents,
  currency,
  rate,
  locale,
  oldPriceLabel,
  size = "md",
  className,
}: {
  usdCents: number;
  promoUsdCents?: number;
  currency: Currency;
  rate: number;
  locale: Locale;
  oldPriceLabel: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const toDisplay = (cents: number) =>
    currency === "USD"
      ? formatMoney(cents, "USD", locale)
      : formatMoney(usdCentsToCdf(cents, rate), "CDF", locale);
  const hasPromo = promoUsdCents !== undefined && promoUsdCents < usdCents;
  const current = hasPromo ? promoUsdCents : usdCents;

  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span
        className={cn(
          "bg-taxi font-mono font-bold text-ink rounded-[calc(var(--radius-control)/2)]",
          size === "lg" ? "px-2.5 py-1 text-xl" : "px-1.5 py-0.5 text-sm",
        )}
      >
        {toDisplay(current)}
      </span>
      {hasPromo ? (
        <s className="font-mono text-xs text-muted">
          <span className="sr-only">{oldPriceLabel} </span>
          {toDisplay(usdCents)}
        </s>
      ) : null}
    </span>
  );
}
