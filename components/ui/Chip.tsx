import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "./cn";

const base =
  "inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 text-[13px] font-medium transition-colors";

function classes(selected: boolean | undefined, onDark?: boolean) {
  if (onDark) {
    return cn(
      base,
      selected ? "border-white bg-white text-[#0f1111]" : "border-white/30 text-white hover:border-white/70",
    );
  }
  return cn(
    base,
    selected ? "border-fg bg-fg text-surface" : "border-fg/15 bg-surface text-fg hover:border-fg/40",
  );
}

/** Puce de filtre. Lien (navigation) ou bouton bascule (aria-pressed). */
export function Chip({
  href,
  selected,
  onDark,
  children,
  onClick,
}: {
  href?: string;
  selected?: boolean;
  /** Puce posée sur l'en-tête bleu nuit. */
  onDark?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  if (href) {
    return (
      <Link
        href={href}
        prefetch={false}
        className={classes(selected, onDark)}
        aria-current={selected ? "true" : undefined}
      >
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={classes(selected, onDark)} aria-pressed={!!selected} onClick={onClick}>
      {children}
    </button>
  );
}
