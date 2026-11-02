"use client";

import { favoritesStore, toggleFavorite } from "@/lib/client/shop";
import { useStore } from "@/lib/client/store";
import { IconHeart } from "@/components/ui/icons";
import { cn } from "@/components/ui/cn";

export function FavoriteButton({
  slug,
  addLabel,
  removeLabel,
}: {
  slug: string;
  addLabel: string;
  removeLabel: string;
}) {
  const on = useStore(favoritesStore).includes(slug);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? removeLabel : addLabel}
      onClick={() => toggleFavorite(slug)}
      className={cn(
        "grid size-12 shrink-0 place-items-center border-2 rounded-[var(--radius-control)] transition-colors",
        on ? "border-laterite text-laterite" : "border-line text-fg hover:border-fg",
      )}
    >
      <IconHeart size={22} filled={on} />
    </button>
  );
}
