import { IconSearch } from "./icons";

/** Champ de recherche : simple formulaire GET (fonctionne sans JavaScript). */
export function SearchField({
  action,
  label,
  placeholder,
  submitLabel,
  defaultValue,
}: {
  action: string;
  label: string;
  placeholder: string;
  submitLabel: string;
  defaultValue?: string;
}) {
  return (
    <form action={action} method="get" role="search" className="flex">
      <label className="flex min-h-12 flex-1 items-center gap-2 border-2 border-line bg-surface px-3 focus-within:border-fg rounded-l-[var(--radius-control)]">
        <IconSearch size={18} className="text-muted" />
        <span className="sr-only">{label}</span>
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          enterKeyHint="search"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent py-2 text-base text-fg outline-none placeholder:text-muted"
        />
      </label>
      <button
        type="submit"
        className="min-h-12 bg-fg px-4 text-sm font-medium text-bg rounded-r-[var(--radius-control)]"
      >
        {submitLabel}
      </button>
    </form>
  );
}
