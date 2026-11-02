"use client";

import { useMemo } from "react";
import { allowedForAge, effectivePrice, type Kind, type ProductSummary } from "@/lib/catalog";
import { parentalStore } from "@/lib/client/shop";
import { useStore } from "@/lib/client/store";
import { setSearchParams, useSearchParam } from "@/lib/client/url";
import type { Locale } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/format";
import { matches } from "@/lib/search";
import { Chip } from "@/components/ui/Chip";
import { ListRow } from "@/components/ui/ListRow";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { Segmented } from "@/components/ui/Segmented";
import { Thumb } from "@/components/ui/Thumb";
import { IconSearch } from "@/components/ui/icons";

export type ExploreItem = ProductSummary & { meta: string; href: string; searchText: string };

type PriceFilter = "all" | "free" | "paid";
type Sort = "popular" | "priceAsc" | "rating";
const SORTS: Sort[] = ["popular", "priceAsc", "rating"];
const PRICE_PARAM: Record<string, PriceFilter> = { gratuit: "free", payant: "paid" };

export interface ExploreLabels {
  searchLabel: string;
  searchPlaceholder: string;
  typeLabel: string;
  all: string;
  kinds: Record<Kind, string>;
  priceLabel: string;
  price: Record<PriceFilter, string>;
  sort: Record<Sort, string>;
  sortButton: string;
  count: string;
  none: string;
  reset: string;
  parental: string;
  free: string;
  oldPrice: string;
  rating: string;
}

export function ExplorerView({
  items,
  kinds,
  locale,
  labels: t,
}: {
  items: ExploreItem[];
  kinds: Kind[];
  locale: Locale;
  labels: ExploreLabels;
}) {
  const q = useSearchParam("q");
  const type = useSearchParam("type") as Kind | "";
  const priceParam = useSearchParam("prix");
  const sortParam = useSearchParam("tri") as Sort | "";
  const parental = useStore(parentalStore);
  const price: PriceFilter = PRICE_PARAM[priceParam] ?? "all";
  const sort: Sort = SORTS.includes(sortParam as Sort) ? (sortParam as Sort) : "popular";

  const list = useMemo(() => {
    let out = items.filter(
      (p) =>
        (!type || p.kind === type) &&
        (price === "all" || (price === "free" ? p.priceUsdCents === 0 : p.priceUsdCents > 0)) &&
        (!parental.enabled || allowedForAge(p, parental.maxAge)) &&
        matches(q, p.searchText),
    );
    if (sort === "popular") out = [...out].sort((a, b) => b.sales - a.sales);
    if (sort === "priceAsc") out = [...out].sort((a, b) => effectivePrice(a) - effectivePrice(b));
    if (sort === "rating") out = [...out].sort((a, b) => b.rating - a.rating);
    return out;
  }, [items, type, price, sort, q, parental]);

  const filtered = Boolean(q || type || price !== "all");

  return (
    <div className="flex flex-col gap-3">
      <label className="flex min-h-12 items-center gap-2 border-2 border-line bg-surface px-3 focus-within:border-fg rounded-[var(--radius-control)]">
        <IconSearch size={18} className="text-muted" />
        <span className="sr-only">{t.searchLabel}</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setSearchParams({ q: e.target.value })}
          placeholder={t.searchPlaceholder}
          enterKeyHint="search"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent py-2 text-base text-fg outline-none placeholder:text-muted"
        />
      </label>

      <div
        role="group"
        aria-label={t.typeLabel}
        className="scroll-rail -mx-4 flex gap-2 overflow-x-auto px-4"
      >
        <Chip selected={!type} onClick={() => setSearchParams({ type: null })}>
          {t.all}
        </Chip>
        {kinds.map((k) => (
          <Chip key={k} selected={type === k} onClick={() => setSearchParams({ type: k })}>
            {t.kinds[k]}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Segmented
          label={t.priceLabel}
          value={price}
          options={(["all", "free", "paid"] as const).map((v) => ({ value: v, label: t.price[v] }))}
          onChange={(v) =>
            setSearchParams({ prix: v === "all" ? null : v === "free" ? "gratuit" : "payant" })
          }
        />
        <button
          type="button"
          onClick={() => setSearchParams({ tri: SORTS[(SORTS.indexOf(sort) + 1) % SORTS.length] })}
          className="min-h-11 border-2 border-line px-3 text-sm font-medium rounded-[var(--radius-control)] hover:border-fg"
        >
          {format(t.sortButton, { sort: t.sort[sort] })}
        </button>
      </div>

      {parental.enabled ? (
        <p className="border-l-4 border-fleuve bg-surface px-3 py-2 text-sm">
          {format(t.parental, { age: parental.maxAge })}
        </p>
      ) : null}

      <p className="text-sm text-muted" aria-live="polite">
        {format(t.count, { count: list.length })}
      </p>

      {list.length ? (
        <ul>
          {list.map((p) => (
            <ListRow
              key={p.slug}
              href={p.href}
              media={
                <Thumb
                  id={`x-${p.slug}`}
                  title={p.title}
                  tone={p.tone}
                  round={p.kind === "game" || p.kind === "edu"}
                />
              }
              title={p.title}
              meta={p.meta}
              extra={<Rating value={p.rating} label={format(t.rating, { rating: p.rating })} />}
              action={
                <Price
                  usdCents={p.priceUsdCents}
                  promoUsdCents={p.promoUsdCents}
                  locale={locale}
                  oldPriceLabel={t.oldPrice}
                  freeLabel={t.free}
                />
              }
            />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-start gap-3 bg-surface p-5">
          <p>{t.none}</p>
          {filtered ? (
            <button
              type="button"
              onClick={() => setSearchParams({ q: null, type: null, prix: null })}
              className="min-h-11 border-2 border-fg px-4 text-sm font-medium rounded-[var(--radius-control)]"
            >
              {t.reset}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
