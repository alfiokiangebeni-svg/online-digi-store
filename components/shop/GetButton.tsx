"use client";

import Link from "next/link";
import { addToLibrary, libraryStore } from "@/lib/client/shop";
import { useStore } from "@/lib/client/store";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";

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
  const cls = cn(buttonClasses({ variant: "secondary", block }), !block && "min-h-11 min-w-24 px-3 text-sm");
  if (owned) {
    return (
      <Link href={libraryHref} prefetch={false} className={cls} aria-label={`${openLabel} — ${title}`}>
        {openLabel}
      </Link>
    );
  }
  return (
    <button
      type="button"
      className={cls}
      aria-label={`${getLabel} — ${title}`}
      onClick={() => addToLibrary([{ slug, paidUsdCents: 0 }])}
    >
      {getLabel}
    </button>
  );
}
