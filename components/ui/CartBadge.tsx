"use client";

import { cartStore } from "@/lib/client/shop";
import { useStore } from "@/lib/client/store";

/** Pastille du nombre d'articles (rien si le panier est vide). */
export function CartBadge({ srTemplate }: { srTemplate: string }) {
  const count = useStore(cartStore).length;
  if (count === 0) return null;
  return (
    <span className="absolute -right-2 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-cta px-1 text-[11px] font-bold leading-none text-[#0f1111]">
      <span aria-hidden="true">{count}</span>
      <span className="sr-only">{srTemplate.replace("{count}", String(count))}</span>
    </span>
  );
}
