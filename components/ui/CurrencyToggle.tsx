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
            "min-h-10 min-w-10 px-2 font-mono text-xs font-bold",
            currency === c ? "bg-fg text-bg" : "text-muted hover:text-fg",
          )}
        >
          {c === "USD" ? "$" : "FC"}
        </button>
      ))}
    </div>
  );
}
