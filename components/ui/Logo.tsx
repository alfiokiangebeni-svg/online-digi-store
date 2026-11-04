import { cn } from "./cn";

/**
 * Logo « di.si store » : toujours en minuscules, avec le point, posé dans une grande
 * pastille vert citron (texte foncé sur le vert, jamais de blanc).
 */
export function Logo({ className, size = "md" }: { className?: string; size?: "md" | "lg" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-primary font-display font-extrabold leading-none tracking-[-0.04em] text-on-primary",
        size === "lg" ? "px-5 py-2.5 text-3xl" : "px-4 py-2 text-[22px]",
        className,
      )}
    >
      di.si<span className="ml-[0.28em] font-bold opacity-75">store</span>
    </span>
  );
}
