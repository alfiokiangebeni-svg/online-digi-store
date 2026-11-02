import { cn } from "./cn";
import { KubaPattern } from "./Kuba";
import type { CoverTone } from "./Ticket";

const TONES: Record<CoverTone, string> = {
  laterite: "bg-laterite-strong text-paper",
  fleuve: "bg-fleuve text-paper",
  ink: "bg-surface-2 text-fg",
  cendre: "bg-cendre text-ink",
  paper: "bg-paper text-ink",
};

/** Vignette carrée (icône d'appli, pochette, image) : initiale + motif Kuba. */
export function Thumb({
  id,
  title,
  tone,
  size = 56,
  round,
  className,
}: {
  id: string;
  title: string;
  tone: CoverTone;
  size?: number;
  /** Coins arrondis « icône d'application » (jeux, applis éducatives). */
  round?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden",
        round ? "rounded-[28%]" : "rounded-[4px]",
        TONES[tone],
        className,
      )}
    >
      <KubaPattern id={`thumb-${id}`} className="kuba-fill" />
      <span className="relative font-display font-bold" style={{ fontSize: size * 0.42 }}>
        {title
          .replace(/^(Le |La |Les |L'|Pack \d+ )/i, "")
          .charAt(0)
          .toUpperCase()}
      </span>
    </span>
  );
}
