"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Kind, ProductSummary } from "@/lib/catalog";
import { lastOrderStore, libraryStore, markDownloaded } from "@/lib/client/shop";
import { useStore } from "@/lib/client/store";
import type { Locale } from "@/lib/i18n/config";
import { formatDate } from "@/lib/i18n/dates";
import { format } from "@/lib/i18n/format";
import { buttonClasses } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/components/ui/cn";
import { ListRow } from "@/components/ui/ListRow";
import { Money } from "@/components/ui/Price";
import { Thumb } from "@/components/ui/Thumb";
import { IconCheck, IconClose } from "@/components/ui/icons";

type Tab = "all" | "apps" | "reading" | "images" | "music";
const TAB_KINDS: Record<Exclude<Tab, "all">, Kind[]> = {
  apps: ["game", "edu"],
  reading: ["ebook", "course", "template"],
  images: ["image"],
  music: ["music"],
};
const DAY = 24 * 60 * 60 * 1000;

export interface LibraryLabels {
  banner: string;
  bannerBody: string;
  close: string;
  tabs: Record<Tab, string>;
  tabsLabel: string;
  download: string;
  downloading: string;
  open: string;
  offline: string;
  newTag: string;
  freeTag: string;
  boughtOn: string;
  empty: string;
  emptyCta: string;
  note: string;
}

export function LibraryView({
  products,
  locale,
  freeHref,
  labels: t,
}: {
  products: Record<string, ProductSummary & { meta: string; href: string }>;
  locale: Locale;
  freeHref: string;
  labels: LibraryLabels;
}) {
  const library = useStore(libraryStore);
  const lastOrder = useStore(lastOrderStore);
  const [tab, setTab] = useState<Tab>("all");
  const [progress, setProgress] = useState<Record<string, number>>({});
  const timers = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  // Heure de référence figée au premier rendu (pas d'appel à l'horloge pendant le rendu).
  const [now] = useState(() => (typeof window === "undefined" ? 0 : Date.now()));

  function download(slug: string) {
    if (timers.current[slug]) return;
    let pct = 0;
    timers.current[slug] = setInterval(() => {
      pct = Math.min(100, pct + 9 + Math.round(Math.random() * 12));
      setProgress((p) => ({ ...p, [slug]: pct }));
      if (pct >= 100) {
        clearInterval(timers.current[slug]);
        delete timers.current[slug];
        markDownloaded(slug);
      }
    }, 220);
  }

  const items = library
    .map((item) => ({ item, p: products[item.slug] }))
    .filter(({ p }) => p && (tab === "all" || TAB_KINDS[tab].includes(p.kind)));
  const showBanner = lastOrder !== null && now - lastOrder.at < 30 * 60 * 1000;

  return (
    <div className="flex flex-col gap-4">
      {showBanner ? (
        <div role="status" className="flex items-start gap-3 border-l-4 border-fleuve bg-surface p-4">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-fleuve text-paper">
            <IconCheck size={16} />
          </span>
          <div className="flex-1">
            <p className="font-bold">
              {t.banner} ·{" "}
              <span className="font-mono">
                {<Money usdCents={lastOrder.totalUsdCents} locale={locale} />}
              </span>
            </p>
            <p className="text-sm text-muted">{t.bannerBody}</p>
          </div>
          <button
            type="button"
            aria-label={t.close}
            onClick={() => lastOrderStore.set(null)}
            className="-m-2 grid size-11 shrink-0 place-items-center text-muted hover:text-fg"
          >
            <IconClose size={18} />
          </button>
        </div>
      ) : null}

      <div
        role="group"
        aria-label={t.tabsLabel}
        className="scroll-rail -mx-4 flex gap-2 overflow-x-auto px-4"
      >
        {(Object.keys(t.tabs) as Tab[]).map((id) => (
          <Chip key={id} selected={tab === id} onClick={() => setTab(id)}>
            {t.tabs[id]}
          </Chip>
        ))}
      </div>

      {items.length ? (
        <ul>
          {items.map(({ item, p }) => {
            const pct = progress[item.slug];
            const downloading = pct !== undefined && pct < 100 && !item.downloaded;
            const tags = [
              item.paidUsdCents === 0 ? t.freeTag : now - item.at < DAY ? t.newTag : null,
              format(t.boughtOn, { date: formatDate(item.at, locale) }),
            ].filter(Boolean);
            return (
              <ListRow
                key={item.slug}
                href={p.href}
                media={
                  <Thumb
                    id={`l-${item.slug}`}
                    title={p.title}
                    tone={p.tone}
                    round={p.kind === "game" || p.kind === "edu"}
                  />
                }
                title={p.title}
                meta={p.meta}
                extra={
                  <span className="flex flex-wrap items-center gap-x-2">
                    {item.downloaded ? (
                      <span className="inline-flex items-center gap-1 text-success">
                        <IconCheck size={12} />
                        {t.offline}
                      </span>
                    ) : null}
                    <span>{tags.join(" · ")}</span>
                  </span>
                }
                action={
                  item.downloaded ? (
                    <Link
                      href={p.href}
                      prefetch={false}
                      className={cn(buttonClasses({ variant: "secondary" }), "min-h-11 px-3 text-sm")}
                    >
                      {t.open}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => download(item.slug)}
                      disabled={downloading}
                      aria-label={downloading ? undefined : `${t.download} — ${p.title}`}
                      className={cn(
                        buttonClasses({ variant: downloading ? "ghost" : "secondary" }),
                        "relative min-h-11 w-32 overflow-hidden px-3 text-sm disabled:opacity-100",
                      )}
                    >
                      {downloading ? (
                        <>
                          <span
                            aria-hidden="true"
                            className="absolute inset-y-0 left-0 bg-fleuve/30"
                            style={{ width: `${pct}%` }}
                          />
                          <span aria-hidden="true" className="relative font-mono">
                            {pct} %
                          </span>
                          <span className="sr-only" aria-live="polite">
                            {format(t.downloading, { percent: pct })}
                          </span>
                        </>
                      ) : (
                        t.download
                      )}
                    </button>
                  )
                }
              />
            );
          })}
        </ul>
      ) : (
        <div className="flex flex-col items-start gap-3 bg-surface p-5">
          <p>{t.empty}</p>
          <Link href={freeHref} className={buttonClasses({ variant: "secondary" })}>
            {t.emptyCta}
          </Link>
        </div>
      )}

      <p className="text-sm text-muted">{t.note}</p>
    </div>
  );
}
