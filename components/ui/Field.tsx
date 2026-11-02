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
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div
        className={cn(
          "flex min-h-12 items-center gap-2 border-2 bg-surface px-3 rounded-[var(--radius-control)]",
          "focus-within:border-fg",
          error ? "border-laterite" : "border-line",
        )}
      >
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={[errorId, hintId].filter(Boolean).join(" ") || undefined}
          className={cn(
            "min-w-0 flex-1 bg-transparent py-2 text-base text-fg outline-none placeholder:text-muted",
            mono && "font-mono tracking-wide",
          )}
          {...input}
        />
        {adornment}
      </div>
      {error ? (
        <p id={errorId} className="text-sm font-medium text-fg">
          <span aria-hidden="true" className="mr-1 inline-block size-2 bg-laterite align-middle" />
          {error}
        </p>
      ) : null}
      {hint ? (
        <p id={hintId} className="text-sm text-muted" aria-live="polite">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
