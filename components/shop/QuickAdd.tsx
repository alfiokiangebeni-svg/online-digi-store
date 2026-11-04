"use client";

import { useRouter } from "next/navigation";
import { addToCart, addToLibrary, cartStore, libraryStore } from "@/lib/client/shop";
import { haptic } from "@/lib/client/haptics";
import { useLocalePath } from "@/lib/client/nav";
import { useStore } from "@/lib/client/store";
import { toast } from "@/lib/client/toast";
import { useFeedbackTexts } from "@/components/feedback/FeedbackProvider";
import { IconCart, IconCheck, IconDownload } from "@/components/ui/icons";
import { cn } from "@/components/ui/cn";

/**
 * Bouton rond d'ajout rapide sur une carte produit.
 * Avant : ajoute (panier, ou bibliothèque si gratuit) et confirme par un message.
 * Après : devient « Voir » et ouvre le panier ou la bibliothèque (plus jamais sans effet).
 */
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
  const router = useRouter();
  const path = useLocalePath();
  const t = useFeedbackTexts();
  const inCart = useStore(cartStore).some((l) => l.slug === slug && !l.giftTo);
  const owned = useStore(libraryStore).some((i) => i.slug === slug);
  const done = free ? owned : inCart || owned;
  const target = free || owned ? path("bibliotheque") : path("panier");

  function act() {
    if (done) {
      router.push(target);
      return;
    }
    haptic();
    if (free) {
      addToLibrary([{ slug, paidUsdCents: 0 }]);
      toast({
        tone: "success",
        message: t.addedToLibrary,
        action: { label: t.openLibrary, href: path("bibliotheque") },
      });
    } else {
      addToCart({ slug });
      toast({ tone: "success", message: t.addedToCart, action: { label: t.viewCart, href: path("panier") } });
    }
  }

  return (
    <button
      type="button"
      aria-label={done ? `${doneLabel} — ${free || owned ? t.openLibrary : t.viewCart}` : label}
      onClick={act}
      className={cn(
        "pressable grid size-10 place-items-center rounded-full",
        done ? "border border-line bg-surface text-success" : "btn-primary",
      )}
    >
      {done ? <IconCheck size={16} /> : free ? <IconDownload size={16} /> : <IconCart size={16} />}
    </button>
  );
}
