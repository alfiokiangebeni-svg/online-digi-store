"use client";

import { useMemo, type ReactNode } from "react";
import { setSearchParams, useSearchParam } from "@/lib/client/url";
import { format } from "@/lib/i18n/format";
import { matches } from "@/lib/search";
import type { CategoryId } from "@/lib/theme";
import { Chip } from "@/components/ui/Chip";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ListRow } from "@/components/ui/ListRow";
import { IconSearch } from "@/components/ui/icons";

export interface ListingItem {
  slug: string;
  href: string;
  title: string;
  meta: string;
  searchText: string;
  /** Filtre principal : type de bien, contrat ou secteur. */
  group: string;
  /** Filtre secondaire : lieu de travail (emplois). */
  mode?: string;
  furnished?: boolean;
  price: number;
  postedDaysAgo: number;
  deadlineDays?: number;
  amount: ReactNode;
  badge?: ReactNode;
}

type Sort = "recent" | "priceAsc" | "deadline";

export interface ListingsLabels {
  searchLabel: string;
  searchPlaceholder: string;
  groupLabel: string;
  modeLabel: string;
  all: string;
  furnishedOnly: string;
  sort: string;
  sorts: Record<Sort, string>;
  count: string;
  none: string;
  reset: string;
}

/** Liste filtrable des annonces d'une catégorie (filtres dans l'URL : partageables). */
export function ListingsView({
  category,
  items,
  groups,
  modes,
  sorts,
  labels: t,
}: {
  category: CategoryId;
  items: ListingItem[];
  groups: { value: string; label: string }[];
  modes?: { value: string; label: string }[];
  sorts: Sort[];
  labels: ListingsLabels;
}) {
  const q = useSearchParam("q");
  const group = useSearchParam("type");
  const mode = useSearchParam("lieu");
  const furnished = useSearchParam("meuble") === "1";
  const sortParam = useSearchParam("tri") as Sort;
  const sort: Sort = sorts.includes(sortParam) ? sortParam : sorts[0];

  const list = useMemo(() => {
    const out = items.filter(
      (i) =>
        (!group || i.group === group) &&
        (!mode || i.mode === mode) &&
        (!furnished || i.furnished) &&
        matches(q, i.searchText),
    );
    const by: Record<Sort, (a: ListingItem, b: ListingItem) => number> = {
      recent: (a, b) => a.postedDaysAgo - b.postedDaysAgo,
      priceAsc: (a, b) => a.price - b.price,
      deadline: (a, b) => (a.deadlineDays ?? 0) - (b.deadlineDays ?? 0),
    };
    return [...out].sort(by[sort]);
  }, [items, group, mode, furnished, sort, q]);

  const filtered = Boolean(q || group || mode || furnished);

  return (
    <div className="flex flex-col gap-3">
      <label className="flex h-[46px] items-center gap-2 rounded-[var(--radius-md)] border border-line bg-surface-2 px-3 focus-within:border-primary">
        <IconSearch size={18} className="text-muted" />
        <span className="sr-only">{t.searchLabel}</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setSearchParams({ q: e.target.value })}
          placeholder={t.searchPlaceholder}
          enterKeyHint="search"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-fg outline-none placeholder:text-muted"
        />
      </label>

      <div
        role="group"
        aria-label={t.groupLabel}
        className="scroll-rail -mx-4 flex gap-2 overflow-x-auto px-4"
      >
        <Chip selected={!group} onClick={() => setSearchParams({ type: null })}>
          {t.all}
        </Chip>
        {groups.map((g) => (
          <Chip key={g.value} selected={group === g.value} onClick={() => setSearchParams({ type: g.value })}>
            {g.label}
          </Chip>
        ))}
      </div>

      {modes ? (
        <div
          role="group"
          aria-label={t.modeLabel}
          className="scroll-rail -mx-4 flex gap-2 overflow-x-auto px-4"
        >
          {modes.map((m) => (
            <Chip
              key={m.value}
              selected={mode === m.value}
              onClick={() => setSearchParams({ lieu: mode === m.value ? null : m.value })}
            >
              {m.label}
            </Chip>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2">
        {category === "realestate" ? (
          <Chip selected={furnished} onClick={() => setSearchParams({ meuble: furnished ? null : "1" })}>
            {t.furnishedOnly}
          </Chip>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => setSearchParams({ tri: sorts[(sorts.indexOf(sort) + 1) % sorts.length] })}
          className="min-h-[38px] rounded-[var(--radius-sm)] border border-line bg-surface px-2.5 text-[13px] hover:bg-surface-2"
        >
          {format(t.sort, { sort: t.sorts[sort] })}
        </button>
      </div>

      <p className="text-[13px] text-muted" aria-live="polite">
        {format(t.count, { count: list.length })}
      </p>

      {list.length ? (
        <ul className="card overflow-hidden">
          {list.map((i) => (
            <ListRow
              key={i.slug}
              href={i.href}
              media={
                <span className="grid size-14 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-terre-soft">
                  <CategoryIcon id={category} size={22} className="text-terre-deep" />
                </span>
              }
              title={i.title}
              meta={i.meta}
              extra={
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-fg">{i.amount}</span>
                  {i.badge}
                </span>
              }
            />
          ))}
        </ul>
      ) : (
        <div className="card flex flex-col items-center gap-3 px-4 py-8 text-center">
          <p className="text-sm text-muted">{t.none}</p>
          {filtered ? (
            <button
              type="button"
              onClick={() => setSearchParams({ q: null, type: null, lieu: null, meuble: null })}
              className="min-h-11 rounded-[var(--radius-sm)] border border-line px-3 text-sm font-semibold"
            >
              {t.reset}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
