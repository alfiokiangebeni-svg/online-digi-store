"use client";

import { setCurrency, useCurrency } from "@/lib/client/prefs";
import { cn } from "./cn";

/** Bascule $ / FC de l'en-tête. */
export function CurrencyToggle({ label }: { label: string }) {
  const currency = useCurrency();
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex border-2 border-line rounded-[var(--radius-control)]"
    >
      {(["USD", "CDF"] as const).map((c) => (
        <button
          key={c}
          type="button"
          role="radio"
          aria-checked={currency === c}
          onClick={() => setCurrency(c)}
          className={cn(
            "min-h-[38px] min-w-[38px] px-2 text-xs font-bold rounded-[6px]",
            currency === c
              ? "bg-surface text-fg shadow-[0_1px_2px_rgb(0_0_0/0.08)]"
              : "text-muted hover:text-fg",
          )}
        >
          {c === "USD" ? "$" : "FC"}
        </button>
      ))}
    </div>
  );
}
