import { cn } from "./cn";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("skeleton rounded-[var(--radius-ticket)]", className)} />;
}

/** Squelette au format d'un ticket produit. */
export function TicketSkeleton() {
  return (
    <div aria-hidden="true" className="ticket w-44 shrink-0 overflow-hidden">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}
