"use client";

import Link from "next/link";
import { recentStore } from "@/lib/client/feedbackStores";
import { useStore } from "@/lib/client/store";
import type { RecentItem } from "./recentItems";

/** « Récemment consultés » : fiches ouvertes sur ce téléphone (masqué s'il n'y en a pas). */
export function RecentRail({ title, items }: { title: string; items: Record<string, RecentItem> }) {
  const recent = useStore(recentStore).filter((id) => items[id]);
  if (!recent.length) return null;
  return (
    <section aria-labelledby="rail-recent" className="card mt-3 pb-3">
      <h2 id="rail-recent" className="px-3 pt-2.5 text-[17px] font-bold">
        {title}
      </h2>
      <ul className="scroll-rail mt-2 flex gap-2.5 overflow-x-auto px-3">
        {recent.map((id) => (
          <li key={id} className="w-40 shrink-0">
            <Link
              href={items[id].href}
              prefetch={false}
              className="pressable flex h-full flex-col gap-1 rounded-[var(--radius-sm)] bg-surface-2 p-3"
            >
              <span className="line-clamp-2 text-[13px] font-semibold">{items[id].title}</span>
              <span className="line-clamp-2 text-xs text-muted">{items[id].meta}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
