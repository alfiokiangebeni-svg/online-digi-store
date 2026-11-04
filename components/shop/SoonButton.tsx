"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import type { ButtonVariant } from "@/components/ui/buttonStyles";
import { Badge } from "@/components/ui/Badge";
import { toast } from "@/lib/client/toast";

/** Fonction pas encore prête : le bouton reste visible, annonce « Bientôt disponible ». */
export function SoonButton({
  label,
  soon,
  icon,
  variant = "outline",
  className,
}: {
  label: string;
  soon: string;
  icon?: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <Button
      variant={variant}
      icon={icon}
      className={className}
      onClick={() => toast({ tone: "info", message: `${label} : ${soon.toLowerCase()}` })}
    >
      {label}
      <Badge tone="neutral" className="ml-1">
        {soon}
      </Badge>
    </Button>
  );
}
