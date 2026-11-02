import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "./cn";

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
  /** Pastille (ex. nombre d'articles du panier). */
  badge?: ReactNode;
}

/** Barre de navigation mobile fixée en bas : 5 onglets. */
export function BottomNav({
  items,
  label,
  fixed = true,
}: {
  items: NavItem[];
  label: string;
  fixed?: boolean;
}) {
  return (
    <nav
      aria-label={label}
      className={cn(
        "z-40 border-t-2 border-line bg-bg pb-[env(safe-area-inset-bottom)]",
        fixed && "fixed inset-x-0 bottom-0",
      )}
    >
      <ul
        className="mx-auto grid max-w-xl"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              prefetch={false}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "relative flex min-h-14 flex-col items-center justify-center gap-0.5 px-0.5 text-[11px] font-medium",
                item.active ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
              {item.active ? (
                <span aria-hidden="true" className="absolute inset-x-5 top-0 h-[3px] bg-fg" />
              ) : null}
              <span className="relative">
                {item.icon}
                {item.badge}
              </span>
              <span className="leading-tight">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
