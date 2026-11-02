import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "./cn";

/** Ligne de liste (gratuits populaires, musique, résultats, panier, bibliothèque). */
export function ListRow({
  href,
  lead,
  media,
  title,
  meta,
  extra,
  action,
  className,
}: {
  href?: string;
  /** Élément interactif placé avant le lien (ex. bouton d'extrait audio). */
  lead?: ReactNode;
  media?: ReactNode;
  title: string;
  meta?: ReactNode;
  extra?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const body = (
    <>
      <span className="row-title">{title}</span>
      {meta ? <span className="row-meta">{meta}</span> : null}
      {extra ? <span className="row-extra">{extra}</span> : null}
    </>
  );
  return (
    <li className={cn("row", className)}>
      {lead}
      {href ? (
        <Link href={href} prefetch={false} className="row-main">
          {media}
          <span className="row-text">{body}</span>
        </Link>
      ) : (
        <div className="row-main">
          {media}
          <span className="row-text">{body}</span>
        </div>
      )}
      {action ? <div className="shrink-0">{action}</div> : null}
    </li>
  );
}
