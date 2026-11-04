"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { addToCart, addToLibrary, cartStore, libraryStore, optionStore } from "@/lib/client/shop";
import type { OptionChoice } from "./ProductOptions";
import { useStore } from "@/lib/client/store";
import { haptic } from "@/lib/client/haptics";
import { toast } from "@/lib/client/toast";
import { useFeedbackTexts } from "@/components/feedback/FeedbackProvider";
import { buttonClasses } from "@/components/ui/buttonStyles";
import { FavoriteButton } from "./FavoriteButton";

/** Barre d'achat fixée en bas de la fiche produit (remplace la navigation). */
export function BuyBar({
  slug,
  free,
  price,
  cartHref,
  libraryHref,
  choices,
  labels,
}: {
  slug: string;
  free: boolean;
  /** Prix effectif déjà formaté côté serveur (deux devises), affiché dans « Acheter ». */
  price: ReactNode;
  cartHref: string;
  libraryHref: string;
  /** Options de la fiche (format, licence) : l'option choisie part avec la ligne de panier. */
  choices?: OptionChoice[];
  labels: {
    buy: string;
    addToCart: string;
    inCart: string;
    get: string;
    open: string;
    owned: string;
    favorite: string;
    unfavorite: string;
  };
}) {
  const router = useRouter();
  const t = useFeedbackTexts();
  const inCart = useStore(cartStore).some((l) => l.slug === slug && !l.giftTo);
  const owned = useStore(libraryStore).some((i) => i.slug === slug);
  const chosen = useStore(optionStore)[slug];
  const current = choices ? (choices.find((c) => c.value === chosen?.option) ?? choices[0]) : undefined;
  const line = { slug, option: current?.value, optionLabel: current?.cartLabel };
  const shownPrice = current?.price ?? price;

  let actions: ReactNode;
  if (owned) {
    actions = (
      <Link href={libraryHref} className={buttonClasses({ variant: "secondary", size: "lg", block: true })}>
        {labels.owned} · {labels.open}
      </Link>
    );
  } else if (free) {
    actions = (
      <button
        type="button"
        className={buttonClasses({ variant: "sell", size: "lg", block: true })}
        onClick={() => {
          haptic();
          addToLibrary([{ slug, paidUsdCents: 0 }]);
          toast({
            tone: "success",
            message: t.addedToLibrary,
            action: { label: t.openLibrary, href: libraryHref },
          });
        }}
      >
        {labels.get}
      </button>
    );
  } else {
    actions = (
      <>
        {inCart ? (
          <Link
            href={cartHref}
            className={buttonClasses({ variant: "secondary", size: "lg", className: "flex-1 px-2" })}
          >
            {labels.inCart}
          </Link>
        ) : (
          <button
            type="button"
            className={buttonClasses({ variant: "soft", size: "lg", className: "flex-1 rounded-full px-2" })}
            onClick={() => {
              haptic();
              addToCart(line);
              toast({
                tone: "success",
                message: t.addedToCart,
                action: { label: t.viewCart, href: cartHref },
              });
            }}
          >
            {labels.addToCart}
          </button>
        )}
        <button
          type="button"
          className={buttonClasses({ variant: "sell", size: "lg", className: "flex-1 rounded-full px-2" })}
          onClick={() => {
            haptic();
            addToCart(line);
            router.push(cartHref);
          }}
        >
          {labels.buy}
        </button>
      </>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface px-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-2.5">
      <div className="mx-auto flex max-w-xl flex-col gap-2">
        {!free && !owned ? (
          <div className="flex items-center justify-end gap-2 text-sm">
            {current ? <span className="text-xs text-muted">{current.cartLabel}</span> : null}
            {shownPrice}
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <FavoriteButton slug={slug} addLabel={labels.favorite} removeLabel={labels.unfavorite} />
          {actions}
        </div>
      </div>
    </div>
  );
}
