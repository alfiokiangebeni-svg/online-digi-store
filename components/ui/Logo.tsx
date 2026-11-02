import { cn } from "./cn";

/** Logo-texte « di.si store » : toujours en minuscules, avec le point en vert citron. */
export function Logo({ className, size = "md" }: { className?: string; size?: "md" | "lg" }) {
  return (
    <span
      className={cn(
        "font-display font-extrabold tracking-[-0.04em] text-fg",
        size === "lg" ? "text-3xl" : "text-[22px]",
        className,
      )}
    >
      di<span className="text-primary">.</span>si <span className="font-bold text-muted">store</span>
    </span>
  );
}
