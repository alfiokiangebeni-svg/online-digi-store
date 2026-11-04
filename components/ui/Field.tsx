import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "./cn";

export interface FieldProps extends Omit<ComponentPropsWithoutRef<"input">, "id"> {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  /** Élément affiché à droite dans le champ (ex. logo opérateur). */
  adornment?: ReactNode;
  mono?: boolean;
}

export function Field({ id, label, hint, error, adornment, mono, className, ...input }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[13px] font-medium text-muted">
        {label}
      </label>
      <div
        className={cn(
          "flex min-h-12 items-center gap-2 rounded-[var(--radius-sm)] border bg-surface-2 px-3",
          "focus-within:border-primary",
          error ? "border-urgent" : "border-line",
        )}
      >
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={[errorId, hintId].filter(Boolean).join(" ") || undefined}
          className={cn(
            "min-w-0 flex-1 bg-transparent py-2 text-[15px] text-fg outline-none placeholder:text-muted",
            mono && "font-mono tracking-wide",
          )}
          {...input}
        />
        {adornment}
      </div>
      {error ? (
        <p id={errorId} className="text-xs font-medium text-urgent-text">
          {error}
        </p>
      ) : null}
      {hint ? (
        <p id={hintId} className="text-xs text-muted" aria-live="polite">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
