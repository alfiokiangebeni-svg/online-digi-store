import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "./cn";
import { KubaPattern } from "./Kuba";

export type CoverTone = "laterite" | "fleuve" | "ink" | "cendre" | "paper";

const COVER_TONES: Record<CoverTone, string> = {
  laterite: "bg-laterite text-paper",
  fleuve: "bg-fleuve text-paper",
  ink: "bg-ink text-paper",
  cendre: "bg-cendre text-ink",
  paper: "bg-paper text-ink",
};

/** Couverture typographique (en attendant les visuels vendeurs, et en mode données légères). */
export function TicketCover({
  id,
  tone,
  title,
  kids,
}: {
  id: string;
  tone: CoverTone;
  title: string;
  kids?: boolean;
}) {
  return (
    <div aria-hidden="true" className={cn("cover", COVER_TONES[tone])}>
      <KubaPattern id={`kuba-${id}`} className="kuba-fill" />
      {kids ? <span className="absolute -right-6 -top-6 size-28 rounded-full bg-current opacity-20" /> : null}
      <span className={cn("cover-title", kids && "text-2xl")}>{title}</span>
    </div>
  );
}

/**
 * Ticket produit : coin coupé, perforation entre visuel et prix.
 * `cover` est un nœud pour accepter une couverture typographique ou une photo (next/image).
 */
export function Ticket({
  href,
  title,
  kindLabel,
  seller,
  cover,
  price,
  badges,
  meta,
  kids,
  className,
}: {
  href?: string;
  title: string;
  kindLabel: string;
  seller: string;
  cover: ReactNode;
  price: ReactNode;
  badges?: ReactNode;
  meta?: ReactNode;
  kids?: boolean;
  className?: string;
}) {
  const heading = href ? (
    <Link href={href} prefetch={false} className="stretched">
      {title}
    </Link>
  ) : (
    title
  );
  return (
    <article className={cn("ticket ticket-card", kids && "kids", className)}>
      <div className="relative">
        {cover}
        {badges ? <div className="ticket-badges">{badges}</div> : null}
      </div>
      <div className="ticket-perforation" />
      <div className="ticket-body">
        <p className="ticket-kind">{kindLabel}</p>
        <h3 className="ticket-title">{heading}</h3>
        <p className="ticket-sub">{seller}</p>
        {meta ? <div className="ticket-meta">{meta}</div> : null}
        <div className="ticket-price">{price}</div>
      </div>
    </article>
  );
}
