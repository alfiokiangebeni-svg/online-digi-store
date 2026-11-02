"use client";

import { cartStore } from "@/lib/client/shop";
import { useStore } from "@/lib/client/store";

/** Pastille du nombre d'articles (rien si le panier est vide). */
export function CartBadge({ srTemplate }: { srTemplate: string }) {
  const count = useStore(cartStore).length;
  if (count === 0) return null;
  return (
    <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-taxi px-1 font-mono text-[11px] font-bold leading-5 text-ink">
      <span aria-hidden="true">{count}</span>
      <span className="sr-only">{srTemplate.replace("{count}", String(count))}</span>
    </span>
  );
}
