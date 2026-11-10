import { Money } from "@/components/ui/Price";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/components/ui/cn";

/** Loyer : montant (USD ou FC selon la devise choisie) + « / mois » ou « / jour ». */
export function RentPrice({
  usdCents,
  template,
  locale,
  large,
}: {
  usdCents: number;
  /** « {price} / mois » */
  template: string;
  locale: Locale;
  large?: boolean;
}) {
  const [before, after] = template.split("{price}");
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1">
      {before ? <span className="text-xs font-medium text-muted">{before.trim()}</span> : null}
      <span className={cn("price-tag", large ? "text-[26px]" : "text-[15px]")}>
        <Money usdCents={usdCents} locale={locale} />
      </span>
      {after ? <span className="text-xs font-medium text-muted">{after.trim()}</span> : null}
    </span>
  );
}
