"use client";

import Link from "next/link";
import { categoryOf, type ProductSummary } from "@/lib/catalog";
import { libraryStore } from "@/lib/client/shop";
import { useStore } from "@/lib/client/store";
import { useSearchParam } from "@/lib/client/url";
import { buttonClasses } from "@/components/ui/buttonStyles";
import { Badge } from "@/components/ui/Badge";
import { Thumb } from "@/components/ui/Thumb";
import { TicketCover } from "@/components/ui/Ticket";
import { PreviewButton } from "./PreviewButton";

export interface ReaderLabels {
  title: string;
  notOwned: string;
  seeProduct: string;
  readerSoon: string;
  installSoon: string;
  hdSoon: string;
  listenDemo: string;
  back: string;
  soon: string;
  listen: string;
  pause: string;
}

/**
 * Ouvre un contenu de la bibliothèque. Ce qui fonctionne déjà (extrait audio) est
 * jouable ; ce qui attend les fichiers des vendeurs est annoncé « Bientôt disponible ».
 */
export function ReaderView({
  products,
  libraryHref,
  labels: t,
}: {
  products: Record<string, ProductSummary & { meta: string; href: string }>;
  libraryHref: string;
  labels: ReaderLabels;
}) {
  const slug = useSearchParam("id");
  const library = useStore(libraryStore);
  const p = products[slug];
  const owned = library.some((i) => i.slug === slug);

  if (!p || !owned) {
    return (
      <div className="card flex flex-col items-center gap-3 px-4 py-8 text-center">
        <p className="text-sm text-muted">{t.notOwned}</p>
        {p ? (
          <Link href={p.href} className={buttonClasses({ variant: "outline" })}>
            {t.seeProduct}
          </Link>
        ) : null}
        <Link href={libraryHref} className={buttonClasses({ variant: "ghost" })}>
          {t.back}
        </Link>
      </div>
    );
  }

  const category = categoryOf(p.kind);
  const soonText =
    p.kind === "music"
      ? null
      : p.kind === "game" || p.kind === "edu"
        ? t.installSoon
        : p.kind === "image" || p.kind === "template"
          ? t.hdSoon
          : t.readerSoon;

  return (
    <div className="flex flex-col gap-3">
      <div className="card flex items-center gap-3 p-3">
        <Thumb title={p.title} category={category} size={56} round={p.kind === "game" || p.kind === "edu"} />
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold">{p.title}</h2>
          <p className="truncate text-xs text-muted">{p.meta}</p>
        </div>
      </div>
      {p.kind === "music" ? (
        <div className="card flex items-center gap-3 p-4">
          <PreviewButton
            id={p.slug}
            title={p.title}
            playLabel={t.listen.replace("{title}", p.title)}
            pauseLabel={t.pause}
          />
          <p className="text-sm text-muted">{t.listenDemo}</p>
        </div>
      ) : (
        <div className="card flex flex-col gap-3 p-4">
          <div className="overflow-hidden rounded-[var(--radius-sm)]">
            <TicketCover title={p.title} category={category} className="aspect-[4/3]" />
          </div>
          <Badge tone="neutral" className="self-start">
            {t.soon}
          </Badge>
          <p className="text-sm text-muted">{soonText}</p>
        </div>
      )}
      <Link href={libraryHref} className={buttonClasses({ variant: "outline", block: true })}>
        {t.back}
      </Link>
    </div>
  );
}
