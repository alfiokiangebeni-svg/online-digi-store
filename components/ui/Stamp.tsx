import { cn } from "./cn";

/** Tampon « LIVRÉ » qui s'imprime sur le ticket après paiement. */
export function Stamp({
  label,
  className,
  announce = true,
}: {
  label: string;
  className?: string;
  /** false quand le parent est déjà une région annoncée (évite la double lecture). */
  announce?: boolean;
}) {
  return (
    <span
      role={announce ? "status" : undefined}
      className={cn(
        "inline-block animate-stamp border-4 border-double border-success px-3 py-1",
        "text-2xl font-bold uppercase tracking-widest text-success",
        "rounded-[4px] [transform:rotate(-12deg)]",
        className,
      )}
    >
      {label}
    </span>
  );
}
