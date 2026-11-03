"use client";

import Link from "next/link";
import { categoryOf, type ProductSummary } from "@/lib/catalog";
import { useState } from "react";
import { libraryStore, readingStore } from "@/lib/client/shop";
import { format } from "@/lib/i18n/format";
import { Button } from "@/components/ui/Button";
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
  book: {
    resume: string;
    page: string;
    prev: string;
    next: string;
    extract: string;
    extractEnd: string;
    extractBody: string;
    buyToContinue: string;
    restart: string;
    saved: string;
    samplePages: string[];
  };
}

/** Nombre de pages lisibles dans l'extrait gratuit. */
const EXTRACT_PAGES = 2;

/** Lecteur de livre intégré : pages, reprise de lecture, extrait gratuit. */
function BookReader({
  slug,
  description,
  extract,
  productHref,
  t,
}: {
  slug: string;
  description: string;
  extract: boolean;
  productHref: string;
  t: ReaderLabels["book"];
}) {
  const pages = [description, ...t.samplePages];
  const saved = useStore(readingStore)[slug] ?? 0;
  const total = extract ? EXTRACT_PAGES : pages.length;
  const page = Math.min(extract ? 0 : saved, total - 1);
  const [view, setView] = useState<number | null>(null);
  const current = view ?? page;
  const go = (n: number) => {
    setView(n);
    if (!extract) readingStore.set((r) => ({ ...r, [slug]: n }));
  };
  const atEnd = current === total - 1;
  return (
    <div className="flex flex-col gap-3">
      {extract ? (
        <Badge tone="neutral" className="self-start">
          {t.extract}
        </Badge>
      ) : saved > 0 && view === null ? (
        <p className="text-xs text-muted">{t.saved}</p>
      ) : null}
      <article aria-live="polite" className="card min-h-64 p-5 font-sans text-[17px] leading-relaxed">
        {pages[current]}
      </article>
      <p className="text-center text-xs text-muted">{format(t.page, { page: current + 1, total })}</p>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" disabled={current === 0} onClick={() => go(current - 1)}>
          {t.prev}
        </Button>
        <Button className="flex-1" disabled={atEnd} onClick={() => go(current + 1)}>
          {t.next}
        </Button>
      </div>
      {extract && atEnd ? (
        <div className="card flex flex-col gap-2 p-4">
          <p className="font-semibold">{t.extractEnd}</p>
          <p className="text-sm text-muted">{t.extractBody}</p>
          <Link href={productHref} className={buttonClasses({ variant: "primary", block: true })}>
            {t.buyToContinue}
          </Link>
        </div>
      ) : null}
      {!extract && current > 0 ? (
        <Button variant="ghost" onClick={() => go(0)}>
          {t.restart}
        </Button>
      ) : null}
    </div>
  );
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
  products: Record<string, ProductSummary & { meta: string; href: string; description: string }>;
  libraryHref: string;
  labels: ReaderLabels;
}) {
  const slug = useSearchParam("id");
  const extractMode = useSearchParam("extrait") === "1";
  const library = useStore(libraryStore);
  const p = products[slug];
  const owned = library.some((i) => i.slug === slug);

  if (p && p.kind === "ebook" && (owned || extractMode)) {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-bold">{p.title}</h2>
        <BookReader
          slug={p.slug}
          description={p.description}
          extract={!owned}
          productHref={p.href}
          t={t.book}
        />
        <Link
          href={owned ? libraryHref : p.href}
          className={buttonClasses({ variant: "outline", block: true })}
        >
          {owned ? t.back : t.seeProduct}
        </Link>
      </div>
    );
  }

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
