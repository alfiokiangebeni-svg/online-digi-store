import type { ReactNode } from "react";
import { cn } from "./cn";

export type BadgeTone = "promo" | "flash" | "new" | "success" | "neutral" | "verified";

const TONES: Record<BadgeTone, string> = {
  promo: "bg-taxi text-ink",
  flash: "bg-laterite-strong text-paper",
  new: "border-2 border-laterite text-fg",
  success: "bg-fleuve text-paper",
  neutral: "bg-surface-2 text-fg",
  verified: "border-2 border-fleuve text-success",
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
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium uppercase tracking-wide",
        "rounded-[calc(var(--radius-control)/2)]",
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
