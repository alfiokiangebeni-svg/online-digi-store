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
        "z-40 border-t border-[#e5e7eb] bg-surface pb-[env(safe-area-inset-bottom)] dark:border-line",
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
                "relative flex min-h-16 flex-col items-center justify-center gap-[3px] px-0.5 text-[11px]",
                item.active
                  ? "font-semibold text-fg [&_svg]:stroke-[2.6]"
                  : "font-medium text-muted hover:text-fg",
              )}
            >
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
