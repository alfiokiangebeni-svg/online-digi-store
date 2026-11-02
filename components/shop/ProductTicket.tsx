import { Badge, IconCheck, Price, Ticket, TicketCover } from "@/components/ui";
import { DEMO_USD_TO_CDF_RATE, discountPercent, type Currency } from "@/lib/currency";
import type { Locale } from "@/lib/i18n/config";
import { format, type Dictionary } from "@/lib/i18n";
import type { DemoProduct } from "@/lib/demo/products";

export function ProductTicket({
  product: p,
  locale,
  dict,
  currency = "USD",
}: {
  product: DemoProduct;
  locale: Locale;
  dict: Dictionary;
  currency?: Currency;
}) {
  const kids = p.kind === "kidsApp" || p.rails.includes("kids");
  const percent = p.promoUsdCents ? discountPercent(p.priceUsdCents, p.promoUsdCents) : 0;
  return (
    <Ticket
      kids={kids}
      title={p.title}
      kindLabel={dict.product.kinds[p.kind]}
      seller={format(dict.product.by, { seller: p.seller })}
      cover={<TicketCover id={p.id} tone={p.tone} title={p.title} kids={kids} />}
      badges={
        <>
          {percent > 0 ? <Badge tone="promo">{format(dict.product.discount, { percent })}</Badge> : null}
          {p.isNew ? <Badge tone="flash">{dict.product.new}</Badge> : null}
        </>
      }
      meta={
        <span className="flex flex-wrap items-center gap-x-2">
          <span>
            {format(dict.product.sales, {
              count: p.sales.toLocaleString(locale === "en" ? "en-US" : "fr-CD"),
            })}
          </span>
          {p.verified ? (
            <span className="inline-flex items-center gap-0.5 text-success">
              <IconCheck size={12} />
              <span className="sr-only">{dict.product.verifiedSeller}</span>
            </span>
          ) : null}
        </span>
      }
      price={
        <Price
          usdCents={p.priceUsdCents}
          promoUsdCents={p.promoUsdCents}
          currency={currency}
          rate={DEMO_USD_TO_CDF_RATE}
          locale={locale}
          oldPriceLabel={dict.product.oldPrice}
        />
      }
    />
  );
}
