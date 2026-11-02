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
    <div
      aria-hidden="true"
      className={cn("relative flex aspect-[4/5] w-full items-end overflow-hidden p-3", COVER_TONES[tone])}
    >
      <KubaPattern id={`kuba-${id}`} className="absolute inset-0 h-full w-full opacity-[0.15]" />
      {kids ? <span className="absolute -right-6 -top-6 size-28 rounded-full bg-current opacity-20" /> : null}
      <span className={cn("relative font-display font-bold leading-[0.95]", kids ? "text-2xl" : "text-xl")}>
        {title}
      </span>
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
    <Link href={href} className="after:absolute after:inset-0 after:content-['']">
      {title}
    </Link>
  ) : (
    title
  );
  return (
    <article
      className={cn("ticket flex w-44 shrink-0 flex-col overflow-hidden", kids && "kids w-48", className)}
    >
      <div className="relative">
        {cover}
        {badges ? <div className="absolute left-2 top-2 flex flex-wrap gap-1">{badges}</div> : null}
      </div>
      <div className="ticket-perforation" />
      <div className="flex flex-1 flex-col gap-1.5 p-3 pt-2.5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{kindLabel}</p>
        <h3 className={cn("font-display font-bold leading-tight", kids ? "text-lg" : "text-base")}>
          {heading}
        </h3>
        <p className="text-sm text-muted">{seller}</p>
        {meta ? <div className="text-xs text-muted">{meta}</div> : null}
        <div className="mt-auto pt-1">{price}</div>
      </div>
    </article>
  );
}
