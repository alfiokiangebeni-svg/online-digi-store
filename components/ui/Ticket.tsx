import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "./cn";

export type CoverTone = "laterite" | "fleuve" | "ink" | "cendre" | "paper";

/** Teintes douces des visuels (en attendant les images vendeurs). Contraste AA vérifié. */
export const COVER_TONES: Record<CoverTone, string> = {
  laterite: "bg-[#fde4da] text-[#9a3412]",
  fleuve: "bg-[#ddf0c8] text-[#3f6212]",
  ink: "bg-ink text-lime-strong",
  cendre: "bg-cloud text-[#3a3f47]",
  paper: "bg-[#fff4d6] text-[#7a4d00]",
};

/** Visuel typographique d'un produit (zone image de la carte). */
export function TicketCover({
  tone,
  title,
}: {
  id?: string;
  tone: CoverTone;
  title: string;
  kids?: boolean;
}) {
  return (
    <div aria-hidden="true" className={cn("cover", COVER_TONES[tone])}>
      <span className="cover-title">{title}</span>
    </div>
  );
}

/**
 * Carte produit (« Offres de la semaine ») : visuel, remise en coin, nom, type, prix.
 * `cover` accepte le visuel typographique ou une photo (next/image).
 */
export function Ticket({
  href,
  title,
  kindLabel,
  cover,
  price,
  badges,
  className,
}: {
  href?: string;
  title: string;
  kindLabel: string;
  seller?: string;
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
    <article className={cn("ticket ticket-card", className)}>
      <div className="relative">
        {cover}
        {badges ? <div className="ticket-badges">{badges}</div> : null}
      </div>
      <div className="ticket-body">
        <h3 className="ticket-title">{heading}</h3>
        <p className="ticket-kind">{kindLabel}</p>
        <div className="ticket-price">{price}</div>
      </div>
    </article>
  );
}
