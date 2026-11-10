"use client";

import { createStore } from "./store";

/** Suivi local des démarches (démo sans serveur) : candidatures, offres, visites, cautions, devis. */
export type ActivityKind = "application" | "cv" | "submission" | "visit" | "deposit" | "quote";
export type ActivityStatus = "sent" | "review" | "pending" | "paid";

export interface Activity {
  id: string;
  kind: ActivityKind;
  /** Annonce ou produit concerné (absent pour une demande de devis). */
  slug?: string;
  title: string;
  at: number;
  status: ActivityStatus;
  detail?: string;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

export const activityStore = createStore<Activity[]>(
  "ds-activity",
  [],
  (v): v is Activity[] => Array.isArray(v) && v.every((x) => isObj(x) && typeof x.kind === "string"),
);

export function recordActivity(a: Omit<Activity, "id" | "at">) {
  const now = Date.now();
  activityStore.set((list) => [{ ...a, id: `${a.kind}-${now}`, at: now }, ...list]);
}

export const hasActivity = (list: Activity[], kind: ActivityKind, slug: string) =>
  list.some((a) => a.kind === kind && a.slug === slug);

/** Alertes « nouvelle annonce » par catégorie. */
export const alertsStore = createStore<string[]>(
  "ds-alerts",
  [],
  (v): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string"),
);

export function toggleAlert(category: string): boolean {
  let on = false;
  alertsStore.set((list) => {
    on = !list.includes(category);
    return on ? [...list, category] : list.filter((c) => c !== category);
  });
  return on;
}
