import type { ReactNode } from "react";
import { IconSearch } from "./icons";

/**
 * Barre de recherche permanente (formulaire GET : fonctionne sans JavaScript).
 * `tools` : boutons à droite du champ (recherche vocale, scan), affichés seulement
 * quand l'appareil les prend en charge.
 */
export function SearchField({
  action,
  label,
  placeholder,
  submitLabel,
  defaultValue,
  tools,
}: {
  action: string;
  label: string;
  placeholder: string;
  submitLabel: string;
  defaultValue?: string;
  tools?: ReactNode;
}) {
  return (
    <form
      action={action}
      method="get"
      role="search"
      className="flex h-12 items-center gap-1 rounded-full border-2 border-primary bg-surface pl-4 pr-1 focus-within:border-primary-text"
    >
      <IconSearch size={18} className="shrink-0 text-muted" />
      <label className="flex min-w-0 flex-1">
        <span className="sr-only">{label}</span>
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          enterKeyHint="search"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-fg outline-none placeholder:text-muted"
        />
      </label>
      {tools}
      <button
        type="submit"
        aria-label={submitLabel}
        className="grid h-9 w-11 shrink-0 place-items-center rounded-full bg-night text-on-accent hover:opacity-90"
      >
        <IconSearch size={18} />
      </button>
    </form>
  );
}
