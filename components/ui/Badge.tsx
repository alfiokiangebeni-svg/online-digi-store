import type { ReactNode } from "react";
import { cn } from "./cn";

/**
 * Badges : chaque couleur marketing a un sens (docs/DESIGN.md).
 * Texte toujours foncé (onPrimary) sur fond coloré : contraste ≥ 5,9:1.
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

const TONES: Record<BadgeTone, string> = {
  promo: "bg-promo text-on-primary",
  flash: "bg-promo text-on-primary",
  urgent: "bg-urgent text-on-primary",
  trust: "bg-trust text-on-primary",
  new: "bg-trust text-on-primary",
  premium: "bg-premium text-on-primary",
  success: "bg-success text-on-primary",
  neutral: "bg-surface-2 text-fg",
  verified: "px-0 text-trust",
  category: "bg-[var(--cat)] text-on-primary",
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
