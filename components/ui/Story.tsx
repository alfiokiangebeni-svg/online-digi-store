import { COVER_TONES, type CoverTone } from "./Ticket";
import { cn } from "./cn";

/** Vignette « story » (drops du jour) : format vertical, liseré noir si non vue. */
export function Story({ title, tone, seen }: { title: string; tone: CoverTone; seen?: boolean }) {
  return (
    <figure className="w-24 shrink-0">
      <div className={cn("rounded-[12px] p-[2px]", seen ? "bg-line" : "bg-fg")}>
        <div
          className={cn(
            "flex aspect-[9/14] items-end overflow-hidden rounded-[10px] border-2 border-surface p-2",
            COVER_TONES[tone],
          )}
        >
          <span aria-hidden="true" className="text-sm font-bold leading-tight">
            {title}
          </span>
        </div>
      </div>
      <figcaption className="mt-1.5 line-clamp-2 text-xs text-muted">{title}</figcaption>
    </figure>
  );
}
