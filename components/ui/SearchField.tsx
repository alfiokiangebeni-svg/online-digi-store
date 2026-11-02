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
    <form
      action={action}
      method="get"
      role="search"
      className="flex overflow-hidden rounded-[8px] focus-within:ring-3 focus-within:ring-cta"
    >
      <label className="flex h-11 flex-1 items-center gap-2 bg-white px-3 text-[#0f1111]">
        <span className="sr-only">{label}</span>
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          enterKeyHint="search"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent py-2 text-[15px] outline-none placeholder:text-[#6b7280]"
        />
      </label>
      <button
        type="submit"
        aria-label={submitLabel}
        className="grid w-12 place-items-center bg-cta text-[#0f1111]"
      >
        <IconSearch size={20} />
      </button>
    </form>
  );
}
