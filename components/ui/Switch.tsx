"use client";

import { cn } from "./cn";

/** Interrupteur accessible (role="switch"). Libellé visible fourni par le parent via aria-labelledby ou label. */
export function Switch({
  checked,
  onChange,
  label,
  labelledBy,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  labelledBy?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-labelledby={labelledBy}
      onClick={() => onChange(!checked)}
      className="grid min-h-11 min-w-14 shrink-0 place-items-center"
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-block h-6 w-11 rounded-full border-2 transition-colors",
          checked ? "border-fleuve bg-fleuve" : "border-line bg-surface-2",
        )}
      >
        <span
          className={cn(
            "absolute left-0 top-0.5 size-4 rounded-full transition-transform",
            checked ? "translate-x-5.5 bg-paper" : "translate-x-0.5 bg-fg",
          )}
        />
      </span>
    </button>
  );
}
