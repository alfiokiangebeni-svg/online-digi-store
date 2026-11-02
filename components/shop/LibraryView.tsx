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
    <div className="flex flex-col gap-3">
      {showBanner ? (
        <div role="status" className="flex items-start gap-3 rounded-[10px] bg-ink p-3.5">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-lime-strong text-ink">
            <IconCheck size={15} />
          </span>
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-white">
              {t.banner} ·{" "}
              <span className="font-mono">
                {<Money usdCents={lastOrder.totalUsdCents} locale={locale} />}
              </span>
            </p>
            <p className="text-[13px] leading-snug text-steel">{t.bannerBody}</p>
          </div>
          <button
            type="button"
            aria-label={t.close}
            onClick={() => lastOrderStore.set(null)}
            className="-m-2 grid size-11 shrink-0 place-items-center text-steel hover:text-white"
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
        <ul className="card overflow-hidden">
          {items.map(({ item, p }) => {
            const pct = progress[item.slug];
            const downloading = pct !== undefined && pct < 100 && !item.downloaded;
            const isNew = item.paidUsdCents > 0 && now - item.at < DAY;
            const tag =
              item.paidUsdCents === 0
                ? t.freeTag
                : isNew
                  ? t.newTag
                  : format(t.boughtOn, { date: formatDate(item.at, locale) });
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
                  <span className="flex flex-wrap items-center gap-x-2 text-[11px] font-semibold">
                    <span
                      className={
                        item.paidUsdCents === 0 ? "text-success" : isNew ? "text-promo" : "text-muted"
                      }
                    >
                      {tag}
                    </span>
                    {item.downloaded ? (
                      <span className="inline-flex items-center gap-1 text-success">
                        <IconCheck size={11} />
                        {t.offline}
                      </span>
                    ) : null}
                  </span>
                }
                action={
                  item.downloaded ? (
                    <Link
                      href={p.href}
                      prefetch={false}
                      className="inline-flex h-9 w-[110px] items-center justify-center rounded-[6px] border border-steel bg-surface text-[13px] font-semibold"
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
                        "relative inline-flex h-9 w-[110px] items-center justify-center overflow-hidden rounded-[6px] text-[13px] font-semibold",
                        downloading ? "border border-steel bg-surface" : "btn-primary",
                      )}
                    >
                      {downloading ? (
                        <>
                          <span
                            aria-hidden="true"
                            className="absolute inset-y-0 left-0 bg-fleuve/30"
                            style={{ width: `${pct}%` }}
                          />
                          <span aria-hidden="true" className="relative">
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
        <div className="card flex flex-col items-center gap-3 px-4 py-8 text-center">
          <p className="text-sm text-muted">{t.empty}</p>
          <Link href={freeHref} className={buttonClasses({ variant: "secondary" })}>
            {t.emptyCta}
          </Link>
        </div>
      )}

      <p className="text-xs leading-relaxed text-[#3a3f47] dark:text-muted">{t.note}</p>
    </div>
  );
}
