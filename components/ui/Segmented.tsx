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
      className={cn("inline-flex border-2 border-line p-0.5 rounded-[var(--radius-control)]", className)}
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
              "min-h-10 px-3 text-sm font-medium rounded-[calc(var(--radius-control)-2px)] transition-colors",
              on ? "bg-fg text-bg" : "text-fg hover:bg-surface-2",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
