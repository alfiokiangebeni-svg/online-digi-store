"use client";

import { favoritesStore, toggleFavorite } from "@/lib/client/shop";
import { toast } from "@/lib/client/toast";
import { useFeedbackTexts } from "@/components/feedback/FeedbackProvider";
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
  const t = useFeedbackTexts();
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? removeLabel : addLabel}
      onClick={() => {
        toggleFavorite(slug);
        toast({ tone: "success", message: on ? t.favRemoved : t.favAdded });
      }}
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-[8px] border border-steel bg-surface transition-colors",
        on ? "text-urgent-text" : "text-fg hover:border-fg",
      )}
    >
      <IconHeart size={20} filled={on} />
    </button>
  );
}
