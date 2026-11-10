import { cn } from "./cn";

/** Squelette de chargement (au lieu d'un écran vide ou d'un indicateur qui tourne). */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("skeleton rounded-[var(--radius-sm)]", className)} />;
}

/** Squelette au format d'une carte produit. */
export function TicketSkeleton() {
  return (
    <div aria-hidden="true" className="ticket ticket-card">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-col gap-2 p-2.5">
        <Skeleton className="h-3.5 w-11/12" />
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  );
}

/** Squelette d'une ligne de liste. */
export function RowSkeleton() {
  return (
    <div aria-hidden="true" className="row">
      <Skeleton className="size-14 shrink-0" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
