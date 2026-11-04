import { cn } from "./cn";

/**
 * Styles des boutons di.si store (module neutre : utilisable côté serveur et client).
 * - `primary` (alias `sell`) : vert citron plein — UN seul par écran ou par carte ;
 * - `outline` (alias `secondary`, `soft`) : contour, actions secondaires ;
 * - `ghost` : lien texte, actions tertiaires ;
 * - `danger` : contour rouge.
 */
export type ButtonVariant = "primary" | "sell" | "outline" | "secondary" | "soft" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  sell: "btn-primary",
  outline: "btn-outline",
  secondary: "btn-outline",
  soft: "btn-outline",
  ghost: "bg-transparent text-fg underline-offset-4 hover:underline",
  danger: "border border-urgent bg-transparent text-urgent-text hover:bg-surface-2",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-[13px]",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-[15px]",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  block,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
}) {
  return cn(
    "pressable inline-flex select-none items-center justify-center gap-2 font-sans font-semibold",
    "rounded-[var(--radius-md)]",
    "disabled:cursor-not-allowed disabled:opacity-45 aria-disabled:opacity-45",
    VARIANTS[variant],
    SIZES[size],
    block && "w-full",
    className,
  );
}
