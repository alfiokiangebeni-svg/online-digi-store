import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "./cn";

const base =
  "inline-flex min-h-10 items-center gap-2 whitespace-nowrap border px-3.5 text-[13px] font-medium rounded-[6px] transition-colors";

function classes(selected: boolean | undefined) {
  return cn(base, selected ? "border-fg bg-fg text-bg" : "border-line text-fg hover:border-fg");
}

/** Puce de filtre. Lien (navigation) ou bouton bascule (aria-pressed). */
export function Chip({
  href,
  selected,
  children,
  onClick,
}: {
  href?: string;
  selected?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  if (href) {
    return (
      <Link href={href} className={classes(selected)} aria-current={selected ? "true" : undefined}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={classes(selected)} aria-pressed={!!selected} onClick={onClick}>
      {children}
    </button>
  );
}
