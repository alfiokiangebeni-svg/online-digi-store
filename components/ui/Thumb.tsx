import { categoryClass, type CategoryId } from "@/lib/theme";
import type { CoverTone } from "./Ticket";
import { cn } from "./cn";

/** Vignette carrée (icône d'appli, pochette, image) : initiale sur fond teinté par la catégorie. */
export function Thumb({
  title,
  category,
  size = 56,
  round,
  className,
}: {
  id?: string;
  title: string;
  tone?: CoverTone;
  category?: CategoryId;
  size?: number;
  /** Coins « icône d'application » (jeux, applis). */
  round?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className={cn(
        "cover relative grid shrink-0 place-items-center !p-0 font-display font-bold",
        round ? "rounded-[22%]" : "rounded-[var(--radius-sm)]",
        category && categoryClass(category),
        className,
      )}
    >
      <span className="relative text-[var(--cat,var(--color-text-primary))]">
        {title
          .replace(/^(Le |La |Les |L'|Pack \d+ )/i, "")
          .charAt(0)
          .toUpperCase()}
      </span>
    </span>
  );
}
