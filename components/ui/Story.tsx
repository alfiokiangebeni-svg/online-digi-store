import { categoryClass, type CategoryId } from "@/lib/theme";
import type { CoverTone } from "./Ticket";
import { cn } from "./cn";

/** Vignette « story » : format vertical, liseré vert citron si non vue. */
export function Story({
  title,
  category,
  seen,
}: {
  title: string;
  tone?: CoverTone;
  category?: CategoryId;
  seen?: boolean;
}) {
  return (
    <figure className="w-24 shrink-0">
      <div className={cn("rounded-[var(--radius-lg)] p-[2px]", seen ? "bg-line" : "bg-primary")}>
        <div
          className={cn(
            "cover flex aspect-[9/14] items-end rounded-[10px] border-2 border-background p-2",
            category && categoryClass(category),
          )}
        >
          <span aria-hidden="true" className="relative text-sm font-bold leading-tight">
            {title}
          </span>
        </div>
      </div>
      <figcaption className="mt-1.5 line-clamp-2 text-xs text-muted">{title}</figcaption>
    </figure>
  );
}
