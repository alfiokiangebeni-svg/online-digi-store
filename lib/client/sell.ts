"use client";

import { createStore } from "./store";
import type { CategoryId } from "@/lib/theme";

/** Espace vendeur (démo sans serveur) : brouillons, annonces publiées, réponses. */
export type Values = Record<string, string>;

export interface MyListing {
  id: string;
  category: CategoryId;
  values: Values;
  at: number;
  boosted?: boolean;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

export const draftsStore = createStore<Partial<Record<CategoryId, { values: Values; at: number }>>>(
  "ds-drafts",
  {},
  (v): v is Partial<Record<CategoryId, { values: Values; at: number }>> => isObj(v),
);

export const myListingsStore = createStore<MyListing[]>(
  "ds-my-listings",
  [],
  (v): v is MyListing[] => Array.isArray(v) && v.every((x) => isObj(x) && typeof x.id === "string"),
);

export const repliesStore = createStore<Record<string, string>>(
  "ds-replies",
  {},
  (v): v is Record<string, string> => isObj(v),
);

/** Minutes écoulées depuis la publication. */
export const minutesSince = (at: number, now: number) => Math.max(0, Math.floor((now - at) / 60_000));

/** Statistiques simulées, croissantes avec le temps (démo). */
export function statsOf(l: MyListing, now: number) {
  const m = minutesSince(l.at, now);
  const views = 3 + Math.floor(m * 2.5) + (l.boosted ? 40 : 0);
  return {
    live: m >= 1,
    views,
    contacts: Math.floor(views / 9),
    sales: Math.floor(views / 25),
    responses: Math.min(3, 1 + Math.floor(m / 3)),
  };
}
