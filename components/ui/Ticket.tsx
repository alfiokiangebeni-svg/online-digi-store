import Link from "next/link";
import type { ReactNode } from "react";
import { categoryClass, type CategoryId } from "@/lib/theme";
import { CategoryIcon } from "./CategoryIcon";
import { cn } from "./cn";

/** Ancienne notion de teinte, conservée pour compatibilité (sans effet visuel). */
export type CoverTone = "laterite" | "fleuve" | "ink" | "cendre" | "paper";

/**
 * Visuel d'un produit (en attendant les images vendeurs) : fond en relief teinté
 * par la couleur de la catégorie, icône de catégorie, titre.
 */
export function TicketCover({
  title,
  category,
  className,
}: {
  id?: string;
  tone?: CoverTone;
  title: string;
  category?: CategoryId;
  kids?: boolean;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("cover", category && categoryClass(category), className)}>
      {category ? <CategoryIcon id={category} size={22} className="cover-icon" /> : null}
      <span className="cover-title">{title}</span>
    </div>
  );
}

/**
 * Carte produit : bandeau fin de catégorie, visuel carré, badges, nom sur 2 lignes,
 * note et nombre d'avis, prix. Un seul bouton vert par carte (ajout rapide, via `action`).
 */
export function Ticket({
  href,
  title,
  kindLabel,
  cover,
  price,
  badges,
  meta,
  footer,
  action,
  category,
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
  /** Élément sous le prix (barre « x % vendus »…). */
  footer?: ReactNode;
  /** Bouton posé en bas à droite du visuel (ajout rapide). */
  action?: ReactNode;
  category?: CategoryId;
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
    <article className={cn("ticket ticket-card", category && categoryClass(category), className)}>
      <div className="ticket-strip" />
      <div className="relative">
        {cover}
        {badges ? <div className="ticket-badges">{badges}</div> : null}
        {action ? <div className="absolute bottom-2 right-2 z-10">{action}</div> : null}
      </div>
      <div className="ticket-body">
        <h3 className="ticket-title">{heading}</h3>
        {meta ? <div className="ticket-meta">{meta}</div> : <p className="ticket-kind">{kindLabel}</p>}
        <div className="ticket-price">{price}</div>
        {footer ? <div className="relative z-10">{footer}</div> : null}
      </div>
    </article>
  );
}
