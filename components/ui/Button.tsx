"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from "react";
import { haptic } from "@/lib/client/haptics";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "./buttonStyles";

export { buttonClasses, type ButtonSize, type ButtonVariant };

/**
 * Boutons di.si store :
 * - `primary` (alias `sell`) : vert citron plein — UN seul par écran ou par carte ;
 * - `outline` (alias `secondary`, `soft`) : contour, actions secondaires ;
 * - `ghost` : lien texte, actions tertiaires ;
 * - `danger` : contour rouge (supprimer, annuler une commande).
 * `haptic` ajoute une légère vibration (actions d'achat).
 */
interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  icon?: ReactNode;
  haptic?: boolean;
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

export function Button(props: AsButton | AsLink) {
  if (props.href !== undefined) {
    const { variant, size, block, icon, children, className, haptic: vibrate, onClick, ...rest } = props;
    return (
      <Link
        className={buttonClasses({ variant, size, block, className })}
        onClick={(e: MouseEvent<HTMLAnchorElement>) => {
          if (vibrate) haptic();
          onClick?.(e);
        }}
        {...rest}
      >
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
    haptic: vibrate,
    onClick,
    type = "button",
    ...rest
  } = props;
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, block, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={(e) => {
        if (vibrate) haptic();
        onClick?.(e);
      }}
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
