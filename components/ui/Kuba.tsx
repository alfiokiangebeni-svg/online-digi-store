import { cn } from "./cn";

/**
 * Motif géométrique inspiré des velours Kuba (Kasaï) : losanges imbriqués et zigzags.
 * SVG vectoriel, < 1 Ko, couleur héritée (currentColor), opacité 10–15 %.
 */
function KubaTile() {
  return (
    <>
      <path d="M0 8L8 0L16 8L8 16Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 4L12 8L8 12L4 8Z" fill="currentColor" />
      <path d="M16 0H32M16 16H32" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 8l4-4 4 4 4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </>
  );
}

export function KubaPattern({ id, className }: { id: string; className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" className={cn("pointer-events-none", className)}>
      <defs>
        <pattern id={id} width="32" height="16" patternUnits="userSpaceOnUse">
          <KubaTile />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Séparateur de section : bande de motifs Kuba. */
export function KubaDivider({ id, className }: { id: string; className?: string }) {
  return (
    <div role="presentation" className={cn("my-8 h-4 w-full text-fg opacity-[0.13]", className)}>
      <KubaPattern id={id} className="h-full w-full" />
    </div>
  );
}
