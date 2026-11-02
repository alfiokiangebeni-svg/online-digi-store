"use client";

import { setCurrency, useCurrency } from "@/lib/client/prefs";
import { cn } from "./cn";

/** Bascule $ / FC de l'en-tête. */
export function CurrencyToggle({ label, onDark }: { label: string; onDark?: boolean }) {
  const currency = useCurrency();
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("inline-flex rounded-[8px] p-[3px]", onDark ? "bg-white/12" : "bg-fg/6")}
    >
      {(["USD", "CDF"] as const).map((c) => (
        <button
          key={c}
          type="button"
          role="radio"
          aria-checked={currency === c}
          onClick={() => setCurrency(c)}
          className={cn(
            "min-h-[38px] min-w-[38px] rounded-[6px] px-2 text-xs font-bold",
            currency === c
              ? "bg-white text-[#0f1111] shadow-[0_1px_2px_rgb(0_0_0/0.08)]"
              : onDark
                ? "text-white/85 hover:text-white"
                : "text-muted hover:text-fg",
          )}
        >
          {c === "USD" ? "$" : "FC"}
        </button>
      ))}
    </div>
  );
}
