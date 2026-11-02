import { cn } from "./cn";

/** Tampon « LIVRÉ » qui s'imprime sur le ticket après paiement. */
export function Stamp({ label, className }: { label: string; className?: string }) {
  return (
    <span
      role="status"
      className={cn(
        "inline-block animate-stamp border-4 border-double border-fleuve px-3 py-1",
        "font-display text-2xl font-bold uppercase tracking-widest text-success",
        "rounded-[4px] [transform:rotate(-12deg)]",
        className,
      )}
    >
      {label}
    </span>
  );
}
