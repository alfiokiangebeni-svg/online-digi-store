import { cn } from "./cn";

/**
 * Motif géométrique inspiré des velours Kuba (Kasaï) : losanges imbriqués et zigzags.
 * Un seul SVG partagé, appliqué en masque CSS (classe `.kuba` dans globals.css) :
 * couleur héritée (currentColor), aucun nœud SVG répété dans la page.
 * `id` est conservé pour compatibilité mais n'est plus nécessaire.
 */
export function KubaPattern({ className }: { id?: string; className?: string }) {
  return <span aria-hidden="true" className={cn("kuba pointer-events-none block", className)} />;
}

/** Séparateur de section : bande de motifs Kuba (opacité 13 %). */
export function KubaDivider({ className }: { id?: string; className?: string }) {
  return <div role="presentation" className={cn("kuba my-8 h-4 w-full text-fg opacity-[0.13]", className)} />;
}
