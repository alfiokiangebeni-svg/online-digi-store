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
          "relative inline-block h-8 w-[52px] rounded-full transition-colors",
          checked ? "bg-fg" : "bg-steel",
        )}
      >
        <span
          className={cn(
            "absolute left-0 top-[3px] size-[26px] rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.2)] transition-transform",
            checked ? "translate-x-[23px]" : "translate-x-[3px]",
          )}
        />
      </span>
    </button>
  );
}
