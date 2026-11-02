"use client";

import Link from "next/link";
import { addToLibrary, libraryStore } from "@/lib/client/shop";
import { useStore } from "@/lib/client/store";
import { cn } from "@/components/ui/cn";

const base =
  "inline-flex h-9 min-w-[88px] items-center justify-center rounded-[6px] px-3 text-[13px] font-semibold";

/** « Obtenir » un contenu gratuit : il rejoint la bibliothèque, puis le bouton devient « Ouvrir ». */
export function GetButton({
  slug,
  getLabel,
  openLabel,
  libraryHref,
  title,
  block,
}: {
  slug: string;
  getLabel: string;
  openLabel: string;
  libraryHref: string;
  title: string;
  block?: boolean;
}) {
  const owned = useStore(libraryStore).some((i) => i.slug === slug);
  if (owned) {
    return (
      <Link
        href={libraryHref}
        prefetch={false}
        className={cn(base, "border border-steel bg-surface text-fg", block && "w-full")}
        aria-label={`${openLabel} — ${title}`}
      >
        {openLabel}
      </Link>
    );
  }
  return (
    <button
      type="button"
      className={cn(base, "btn-primary", block && "w-full")}
      aria-label={`${getLabel} — ${title}`}
      onClick={() => addToLibrary([{ slug, paidUsdCents: 0 }])}
    >
      {getLabel}
    </button>
  );
}
