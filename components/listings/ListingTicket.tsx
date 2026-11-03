import { IconCheck, Ticket, TicketCover } from "@/components/ui";
import { RentPrice } from "./RentPrice";
import type { Dictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Listing } from "@/lib/listings";
import { DeadlineBadge } from "./DeadlineBadge";
import { listingAmount, listingHref, listingKind, listingMeta } from "./text";

/** Carte d'annonce (rayons de l'accueil, annonces similaires). */
export function ListingTicket({
  listing: l,
  locale,
  dict,
}: {
  listing: Listing;
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.listing;
  const amount = listingAmount(l, dict);
  return (
    <Ticket
      href={listingHref(localePath(locale), l.slug)}
      title={l.title}
      kindLabel={listingKind(l, dict)}
      category={l.category}
      cover={<TicketCover title={listingKind(l, dict)} category={l.category} />}
      badges={l.category === "realestate" ? null : <DeadlineBadge days={l.deadlineDays} label={t.deadline} />}
      meta={
        <span className="line-clamp-2">
          {l.verified ? <IconCheck size={11} className="mr-0.5 inline text-success" /> : null}
          {listingMeta(l, dict)}
        </span>
      }
      price={
        l.category === "realestate" ? (
          <RentPrice
            usdCents={l.priceUsdCents}
            template={l.unit === "month" ? t.perMonth : t.perDay}
            locale={locale}
          />
        ) : (
          <span className="text-[13px] font-bold">{amount}</span>
        )
      }
    />
  );
}
