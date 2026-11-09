"use client";

import type { ReactNode } from "react";
import { useSearchParam } from "@/lib/client/url";
import { matches } from "@/lib/search";
import type { CategoryId } from "@/lib/theme";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ListRow } from "@/components/ui/ListRow";

export interface ListingHit {
  slug: string;
  href: string;
  title: string;
  meta: string;
  searchText: string;
  category: CategoryId;
  amount: ReactNode;
}

/** Résultats d'annonces sous les résultats produits d'une recherche (affichés seulement si « q »). */
export function ListingResults({ items, title }: { items: ListingHit[]; title: string }) {
  const q = useSearchParam("q");
  const hits = q.trim() ? items.filter((i) => matches(q, i.searchText)) : [];
  if (!hits.length) return null;
  return (
    <section aria-labelledby="listing-results" className="mt-4">
      <h2 id="listing-results" className="mb-2 px-1 text-[17px] font-bold">
        {title} ({hits.length})
      </h2>
      <ul className="card overflow-hidden">
        {hits.map((i) => (
          <ListRow
            key={i.slug}
            href={i.href}
            media={
              <span className="grid size-12 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-terre-soft">
                <CategoryIcon id={i.category} size={20} className="text-terre-deep" />
              </span>
            }
            title={i.title}
            meta={i.meta}
            extra={<span className="font-semibold text-fg">{i.amount}</span>}
          />
        ))}
      </ul>
    </section>
  );
}
