import type { ReactNode } from "react";
import { cn } from "./cn";

export type BadgeTone = "promo" | "flash" | "new" | "success" | "neutral" | "verified";

const TONES: Record<BadgeTone, string> = {
  promo: "bg-promo text-white",
  flash: "bg-promo text-white",
  new: "bg-ink text-lime-strong",
  success: "bg-leaf text-white",
  neutral: "bg-surface-2 text-fg",
  verified: "px-0 text-accent",
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
