import { cn } from "./cn";
import { COVER_TONES, type CoverTone } from "./Ticket";

/** Vignette carrée (icône d'appli, pochette, image) avec l'initiale du titre. */
export function Thumb({
  title,
  tone,
  size = 56,
  round,
  className,
}: {
  id?: string;
  title: string;
  tone: CoverTone;
  size?: number;
  /** Coins « icône d'application » (jeux, applis éducatives). */
  round?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className={cn(
        "grid shrink-0 place-items-center font-bold",
        round ? "rounded-[22%]" : "rounded-[6px]",
        COVER_TONES[tone],
        className,
      )}
    >
      {title
        .replace(/^(Le |La |Les |L'|Pack \d+ )/i, "")
        .charAt(0)
        .toUpperCase()}
    </span>
  );
}
