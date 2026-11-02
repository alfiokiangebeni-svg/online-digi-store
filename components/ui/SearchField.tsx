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
      <label className="flex h-[46px] flex-1 items-center gap-2 rounded-[8px] border border-fg/8 bg-surface px-3 focus-within:border-fg">
        <IconSearch size={18} className="text-muted" />
        <span className="sr-only">{label}</span>
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          enterKeyHint="search"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-fg outline-none placeholder:text-muted"
        />
        <button type="submit" className="sr-only">
          {submitLabel}
        </button>
      </label>
    </form>
  );
}
