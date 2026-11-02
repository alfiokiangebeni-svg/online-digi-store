import { Badge, Price, Ticket, TicketCover } from "@/components/ui";
import { discountPercent } from "@/lib/currency";
import type { Product } from "@/lib/catalog";
import { localePath, type Locale } from "@/lib/i18n/config";
import { format, type Dictionary } from "@/lib/i18n";
import { productHref } from "./labels";

/** Carte produit des rayons horizontaux : visuel, remise en coin, nom, type, prix. */
export function ProductTicket({
  product: p,
  locale,
  dict,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}) {
  const percent = p.promoUsdCents ? discountPercent(p.priceUsdCents, p.promoUsdCents) : 0;
  return (
    <Ticket
      href={productHref(localePath(locale), p.slug)}
      title={p.title}
      kindLabel={dict.product.kinds[p.kind]}
      cover={<TicketCover tone={p.tone} title={p.title} />}
      badges={
        percent > 0 ? (
          <Badge tone="promo">{format(dict.product.discount, { percent })}</Badge>
        ) : p.isNew ? (
          <Badge tone="new">{dict.product.new}</Badge>
        ) : null
      }
      price={
        <Price
          usdCents={p.priceUsdCents}
          promoUsdCents={p.promoUsdCents}
          locale={locale}
          oldPriceLabel={dict.product.oldPrice}
          freeLabel={dict.product.free}
        />
      }
    />
  );
}
