import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "./cn";

const base =
  "pressable inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] border px-3.5 text-[13px] font-medium";

/** Onglet / filtre : actif = contour et texte vert citron (pas de fond plein). */
function classes(selected: boolean | undefined) {
  return cn(
    base,
    selected
      ? "border-primary bg-surface-2 text-primary-text"
      : "border-transparent bg-surface-2 text-fg hover:border-line",
  );
}

/** Puce de filtre. Lien (navigation) ou bouton bascule (aria-pressed). */
export function Chip({
  href,
  selected,
  icon,
  children,
  onClick,
}: {
  href?: string;
  selected?: boolean;
  /** Conservé pour compatibilité (en-tête sombre) : même rendu. */
  onDark?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}) {
  if (href) {
    return (
      <Link
        href={href}
        prefetch={false}
        className={classes(selected)}
        aria-current={selected ? "true" : undefined}
      >
        {icon}
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={classes(selected)} aria-pressed={!!selected} onClick={onClick}>
      {icon}
      {children}
    </button>
  );
}
