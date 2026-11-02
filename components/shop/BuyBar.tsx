"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { addToCart, addToLibrary, cartStore, libraryStore } from "@/lib/client/shop";
import { useStore } from "@/lib/client/store";
import { buttonClasses } from "@/components/ui/Button";
import { IconBolt } from "@/components/ui/icons";
import { FavoriteButton } from "./FavoriteButton";

/** Barre d'achat fixée en bas de la fiche produit (remplace la navigation). */
export function BuyBar({
  slug,
  free,
  price,
  cartHref,
  libraryHref,
  labels,
}: {
  slug: string;
  free: boolean;
  /** Prix déjà formaté côté serveur (deux devises). */
  price: ReactNode;
  cartHref: string;
  libraryHref: string;
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
  const inCart = useStore(cartStore).some((l) => l.slug === slug && !l.giftTo);
  const owned = useStore(libraryStore).some((i) => i.slug === slug);

  let actions: ReactNode;
  if (owned) {
    actions = (
      <Link href={libraryHref} className={buttonClasses({ variant: "secondary", block: true })}>
        {labels.owned} · {labels.open}
      </Link>
    );
  } else if (free) {
    actions = (
      <button
        type="button"
        className={buttonClasses({ variant: "secondary", block: true })}
        onClick={() => addToLibrary([{ slug, paidUsdCents: 0 }])}
      >
        {labels.get}
      </button>
    );
  } else {
    actions = (
      <>
        {inCart ? (
          <Link href={cartHref} className={buttonClasses({ variant: "secondary", className: "flex-1 px-3" })}>
            {labels.inCart}
          </Link>
        ) : (
          <button
            type="button"
            className={buttonClasses({ variant: "secondary", className: "flex-1 px-3" })}
            onClick={() => addToCart({ slug })}
          >
            {labels.addToCart}
          </button>
        )}
        <button
          type="button"
          className={buttonClasses({ variant: "sell", className: "flex-1 px-3" })}
          onClick={() => {
            addToCart({ slug });
            router.push(cartHref);
          }}
        >
          <IconBolt size={18} />
          {labels.buy}
        </button>
      </>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-line bg-bg px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
      <div className="mx-auto flex max-w-xl flex-col gap-2">
        {!free && !owned ? <div className="flex justify-end">{price}</div> : null}
        <div className="flex items-center gap-2">
          <FavoriteButton slug={slug} addLabel={labels.favorite} removeLabel={labels.unfavorite} />
          {actions}
        </div>
      </div>
    </div>
  );
}
