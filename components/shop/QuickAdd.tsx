"use client";

import { addToCart, addToLibrary, cartStore, libraryStore } from "@/lib/client/shop";
import { useStore } from "@/lib/client/store";
import { IconCart, IconCheck, IconDownload } from "@/components/ui/icons";
import { cn } from "@/components/ui/cn";

/** Bouton rond d'ajout rapide sur une carte produit (panier, ou bibliothèque si gratuit). */
export function QuickAdd({
  slug,
  free,
  label,
  doneLabel,
}: {
  slug: string;
  free: boolean;
  label: string;
  doneLabel: string;
}) {
  const inCart = useStore(cartStore).some((l) => l.slug === slug && !l.giftTo);
  const owned = useStore(libraryStore).some((i) => i.slug === slug);
  const done = free ? owned : inCart || owned;
  return (
    <button
      type="button"
      aria-label={done ? doneLabel : label}
      aria-pressed={done}
      onClick={() => (free ? addToLibrary([{ slug, paidUsdCents: 0 }]) : addToCart({ slug }))}
      className={cn(
        "grid size-10 place-items-center rounded-full shadow-[0_1px_3px_rgb(0_0_0/0.25)]",
        done ? "bg-leaf text-white" : "btn-primary",
      )}
    >
      {done ? <IconCheck size={16} /> : free ? <IconDownload size={16} /> : <IconCart size={16} />}
    </button>
  );
}
