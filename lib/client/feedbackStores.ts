"use client";

import { createStore } from "./store";

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

export interface Review {
  slug: string;
  stars: number;
  text: string;
  at: number;
}

/** Avis laissés sur ce téléphone (démo ; phase 2 : envoyés et modérés côté serveur). */
export const reviewsStore = createStore<Review[]>(
  "ds-reviews",
  [],
  (v): v is Review[] => Array.isArray(v) && v.every((x) => isObj(x) && typeof x.slug === "string"),
);

/** Fiches signalées depuis ce téléphone. */
export const reportsStore = createStore<{ slug: string; reason: string; at: number }[]>(
  "ds-reports",
  [],
  (v): v is { slug: string; reason: string; at: number }[] => Array.isArray(v) && v.every(isObj),
);

/** Fiches récemment consultées (produits « p: » et annonces « a: »), la plus récente d'abord. */
export const recentStore = createStore<string[]>(
  "ds-recent",
  [],
  (v): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string"),
);
