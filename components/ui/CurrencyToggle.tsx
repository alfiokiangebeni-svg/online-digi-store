"use client";

import { setCurrency, useCurrency } from "@/lib/client/prefs";
import { cn } from "./cn";

/** Sélecteur CDF / USD de l'en-tête. */
export function CurrencyToggle({ label }: { label: string; onDark?: boolean }) {
  const currency = useCurrency();
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex rounded-[var(--radius-sm)] bg-surface-2 p-[3px]"
    >
      {(["USD", "CDF"] as const).map((c) => (
        <button
          key={c}
          type="button"
          role="radio"
          aria-checked={currency === c}
          onClick={() => setCurrency(c)}
          className={cn(
            "pressable min-h-[38px] min-w-[38px] rounded-[6px] px-2 text-xs font-bold",
            currency === c ? "bg-line text-fg" : "text-muted hover:text-fg",
          )}
        >
          {c === "USD" ? "$" : "FC"}
        </button>
      ))}
    </div>
  );
}
