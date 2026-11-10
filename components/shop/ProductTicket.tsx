import { Badge, IconStar, Price, Ticket, TicketCover } from "@/components/ui";
import { discountPercent } from "@/lib/currency";
import { categoryOf, isFree, type Product } from "@/lib/catalog";
import { localePath, type Locale } from "@/lib/i18n/config";
import { format, type Dictionary } from "@/lib/i18n";
import { productHref } from "./labels";
import { QuickAdd } from "./QuickAdd";

/** Ventes à partir desquelles un produit porte le badge doré « Meilleure vente ». */
const BEST_SELLER_SALES = 2000;

/** Part vendue affichée sur les ventes flash (démo : dérivée des ventes). */
export function soldPercent(p: Pick<Product, "sales">) {
  return Math.min(96, 38 + (p.sales % 57));
}

/**
 * Carte produit : visuel carré, remise en coin, nom sur 2 lignes, note et ventes, prix.
 * `flash` ajoute la barre « x % vendus » ; `quickAdd` le bouton rond d'ajout au panier.
 */
export function ProductTicket({
  product: p,
  locale,
  dict,
  flash,
  quickAdd,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
  flash?: boolean;
  quickAdd?: boolean;
}) {
  const percent = p.promoUsdCents ? discountPercent(p.priceUsdCents, p.promoUsdCents) : 0;
  const nf = locale === "en" ? "en-US" : "fr-CD";
  const sold = soldPercent(p);
  return (
    <Ticket
      href={productHref(localePath(locale), p.slug)}
      title={p.title}
      kindLabel={dict.product.kinds[p.kind]}
      category={categoryOf(p.kind)}
      cover={<TicketCover title={p.title} category={categoryOf(p.kind)} />}
      badges={
        percent > 0 ? (
          <Badge tone="promo">{format(dict.product.discount, { percent })}</Badge>
        ) : p.sales >= BEST_SELLER_SALES ? (
          <Badge tone="premium">{dict.badges.bestSeller}</Badge>
        ) : p.isNew ? (
          <Badge tone="new">{dict.product.new}</Badge>
        ) : null
      }
      meta={
        <>
          <IconStar size={11} className="text-star" />
          <span>{p.rating.toLocaleString(nf, { minimumFractionDigits: 1 })}</span>
          <span>({p.reviews.toLocaleString(nf)})</span>
          <span aria-hidden="true">·</span>
          <span>{format(dict.product.sold, { count: p.sales.toLocaleString(nf) })}</span>
        </>
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
      action={
        quickAdd ? (
          <QuickAdd
            slug={p.slug}
            free={isFree(p)}
            label={format(dict.product.quickAdd, { title: p.title })}
            doneLabel={dict.product.added}
          />
        ) : null
      }
      footer={
        flash ? (
          <div className="mt-1 flex flex-col gap-1">
            <div className="sold-bar" role="presentation">
              <span style={{ width: `${sold}%` }} />
            </div>
            <span className="text-[10px] font-semibold text-urgent-text">
              {format(dict.product.soldPct, { percent: sold })}
            </span>
          </div>
        ) : null
      }
    />
  );
}
