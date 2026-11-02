"use client";

import { cn } from "./cn";

/** Choix exclusif compact (prix, devise, thème…). */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("inline-flex bg-fg/6 p-[3px] rounded-[8px]", className)}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "min-h-9 px-3 text-[13px] rounded-[6px] transition-colors",
              on
                ? "bg-surface font-semibold text-fg shadow-[0_1px_2px_rgb(0_0_0/0.08)]"
                : "text-fg hover:bg-surface/60",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
