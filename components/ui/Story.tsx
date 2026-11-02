import type { CoverTone } from "./Ticket";
import { cn } from "./cn";

const TONES: Record<CoverTone, string> = {
  // Texte de 14 px : latérite foncé pour garder un contraste AA.
  laterite: "bg-laterite-strong text-paper",
  fleuve: "bg-fleuve text-paper",
  ink: "bg-surface-2 text-fg",
  cendre: "bg-cendre text-ink",
  paper: "bg-paper text-ink",
};

/** Vignette « story » des Drops du jour : format vertical, liseré latérite si non vue. */
export function Story({ title, tone, seen }: { title: string; tone: CoverTone; seen?: boolean }) {
  return (
    <figure className="w-24 shrink-0">
      <div className={cn("rounded-[10px] p-[3px]", seen ? "bg-line" : "bg-laterite")}>
        <div
          className={cn(
            "flex aspect-[9/14] items-end overflow-hidden rounded-[8px] border-2 border-bg p-2",
            TONES[tone],
          )}
        >
          <span aria-hidden="true" className="font-display text-sm font-bold leading-tight">
            {title}
          </span>
        </div>
      </div>
      <figcaption className="mt-1.5 line-clamp-2 text-xs text-muted">{title}</figcaption>
    </figure>
  );
}
