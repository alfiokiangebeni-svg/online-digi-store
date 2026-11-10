"use client";

import { IconClose, IconMusic } from "@/components/ui/icons";
import { cn } from "@/components/ui/cn";
import { stop, useNowPlaying } from "@/lib/client/player";

/** Mini-lecteur persistant : reste visible d'un écran à l'autre tant qu'un extrait joue. */
export function MiniPlayer({
  label,
  stopLabel,
  raised,
}: {
  label: string;
  stopLabel: string;
  raised?: boolean;
}) {
  const now = useNowPlaying();
  if (!now) return null;
  return (
    <div
      role="region"
      aria-label={label}
      className={cn(
        "fixed inset-x-2 z-40 mx-auto flex max-w-xl items-center gap-3 rounded-[var(--radius-md)] border border-line bg-surface-2 py-1.5 pl-3 pr-1 animate-toast-in",
        raised
          ? "bottom-[calc(8.5rem+env(safe-area-inset-bottom))]"
          : "bottom-[calc(4.75rem+env(safe-area-inset-bottom))]",
      )}
    >
      <span className="grid size-8 shrink-0 animate-beat place-items-center rounded-full bg-primary text-on-primary">
        <IconMusic size={16} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</span>
        <span className="truncate text-sm font-semibold">{now.title}</span>
      </span>
      <button
        type="button"
        onClick={stop}
        aria-label={stopLabel}
        className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-sm)] hover:bg-surface"
      >
        <IconClose size={18} />
      </button>
    </div>
  );
}
