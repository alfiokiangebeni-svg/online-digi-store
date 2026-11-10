import type { ReactNode } from "react";
import { cn } from "./cn";

/**
 * Badges. Palette minimale : rouge = remise / urgence, menthe = succès,
 * tout le reste en neutre (fond en relief, texte clair).
 */
export type BadgeTone =
  | "promo" // −30 %, vente flash
  | "flash"
  | "urgent" // Plus que 3, date limite
  | "trust" // nouveauté, information
  | "new"
  | "premium" // sponsorisé, meilleure vente
  | "success" // livré, envoyé
  | "neutral"
  | "verified" // vendeur vérifié (texte bleu, sans fond)
  | "category"; // repère de catégorie (--cat)

/** Palette minimale : rouge (remises, urgences), menthe (succès), le reste en neutre. */
const TONES: Record<BadgeTone, string> = {
  promo: "bg-urgent-soft text-urgent-text",
  flash: "bg-urgent-soft text-urgent-text",
  urgent: "bg-urgent-soft text-urgent-text",
  trust: "bg-surface-2 text-fg",
  new: "bg-surface-2 text-fg",
  premium: "bg-gold-soft text-gold",
  success: "bg-success-soft text-success",
  neutral: "bg-surface-2 text-fg",
  verified: "px-0 text-success",
  category: "bg-surface-2 text-fg",
};

export function Badge({
  tone = "neutral",
  icon,
  children,
  className,
}: {
  tone?: BadgeTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("badge", TONES[tone], className)}>
      {icon}
      {children}
    </span>
  );
}
