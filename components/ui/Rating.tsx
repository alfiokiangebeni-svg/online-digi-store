import { IconStar } from "./icons";

/** Note sur 5 avec étoile dessinée (pas de glyphe emoji). */
export function Rating({ value, label, count }: { value: number; label: string; count?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-muted">
      <IconStar size={14} className="text-taxi" />
      <span aria-hidden="true" className="font-mono text-fg">
        {value.toFixed(1)}
      </span>
      <span className="sr-only">{label}</span>
      {count ? <span aria-hidden="true">· {count}</span> : null}
    </span>
  );
}
