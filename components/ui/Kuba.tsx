import { cn } from "./cn";

/** Espacement entre sections (l'ancienne bande de motifs Kuba n'existe plus dans ce design). */
export function KubaDivider({ className }: { id?: string; className?: string }) {
  return <div role="presentation" className={cn("h-3", className)} />;
}
