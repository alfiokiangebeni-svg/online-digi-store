import { IconStar } from "./icons";

/** Note sur 5 avec étoile dessinée (pas de glyphe emoji). */
export function Rating({
  value,
  label,
  count,
  locale = "fr",
}: {
  value: number;
  label: string;
  count?: string;
  locale?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted">
      <IconStar size={12} className="text-star" />
      <span aria-hidden="true">
        {value.toLocaleString(locale === "en" ? "en-US" : "fr-CD", { minimumFractionDigits: 1 })}
      </span>
      <span className="sr-only">{label}</span>
      {count ? <span aria-hidden="true">· {count}</span> : null}
    </span>
  );
}
