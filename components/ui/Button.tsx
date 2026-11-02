import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "./cn";

export type ButtonVariant = "sell" | "secondary" | "ghost" | "danger";
export type ButtonSize = "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  // Action principale (acheter, payer) : bouton plein noir, comme la maquette.
  sell: "btn-primary hover:opacity-90 active:opacity-80",
  secondary: "bg-surface text-fg border border-fg hover:bg-surface-2",
  ghost: "bg-transparent text-fg underline-offset-4 hover:underline",
  danger: "bg-promo text-white hover:brightness-110",
};

const SIZES: Record<ButtonSize, string> = {
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-[15px]",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

type AsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    href?: undefined;
    loading?: boolean;
    loadingLabel?: string;
  };
type AsLink = CommonProps & Omit<ComponentPropsWithoutRef<typeof Link>, keyof CommonProps> & { href: string };

export function buttonClasses({
  variant = "sell",
  size = "md",
  block,
  className,
}: Pick<CommonProps, "variant" | "size" | "block" | "className">) {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 font-sans font-semibold",
    "rounded-[8px] transition-[filter,opacity,background-color,color] duration-150",
    "disabled:cursor-not-allowed disabled:opacity-45 aria-disabled:opacity-45",
    VARIANTS[variant],
    SIZES[size],
    block && "w-full",
    className,
  );
}

export function Button(props: AsButton | AsLink) {
  if (props.href !== undefined) {
    const { variant, size, block, icon, children, className, ...rest } = props;
    return (
      <Link className={buttonClasses({ variant, size, block, className })} {...rest}>
        {icon}
        {children}
      </Link>
    );
  }
  const {
    variant,
    size,
    block,
    icon,
    children,
    className,
    loading,
    loadingLabel,
    disabled,
    type = "button",
    ...rest
  } = props;
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, block, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : (
        icon
      )}
      {loading && loadingLabel ? loadingLabel : children}
    </button>
  );
}
