"use client";

import { createStore } from "./store";

/** Article du panier ; `giftTo` (E.164) quand le produit est offert. */
export interface CartLine {
  slug: string;
  giftTo?: string;
}

export interface LibraryItem {
  slug: string;
  /** Horodatage d'ajout (ms). */
  at: number;
  /** Prix payé en cents USD (0 = gratuit). */
  paidUsdCents: number;
  downloaded?: boolean;
}

export interface Parental {
  enabled: boolean;
  maxAge: number;
  /** Code à 4 chiffres. Démo : stocké localement ; phase 2 : haché côté serveur. */
  pin: string | null;
}

export interface LastOrder {
  at: number;
  totalUsdCents: number;
  count: number;
  giftTo?: string[];
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
const isArrayOf =
  <T>(check: (x: unknown) => boolean) =>
  (v: unknown): v is T[] =>
    Array.isArray(v) && v.every(check);

export const cartStore = createStore<CartLine[]>(
  "ds-cart",
  [],
  isArrayOf<CartLine>((x) => isObj(x) && typeof x.slug === "string"),
);
export const favoritesStore = createStore<string[]>(
  "ds-favorites",
  [],
  isArrayOf<string>((x) => typeof x === "string"),
);
export const libraryStore = createStore<LibraryItem[]>(
  "ds-library",
  [],
  isArrayOf<LibraryItem>((x) => isObj(x) && typeof x.slug === "string" && typeof x.at === "number"),
);
export const parentalStore = createStore<Parental>(
  "ds-parental",
  { enabled: false, maxAge: 6, pin: null },
  (v): v is Parental => isObj(v) && typeof v.enabled === "boolean" && typeof v.maxAge === "number",
);
export const lastOrderStore = createStore<LastOrder | null>(
  "ds-last-order",
  null,
  (v): v is LastOrder | null => v === null || (isObj(v) && typeof v.at === "number"),
);

/* Actions */

export function addToCart(line: CartLine) {
  cartStore.set((cart) =>
    cart.some((l) => l.slug === line.slug && l.giftTo === line.giftTo) ? cart : [...cart, line],
  );
}
export function removeFromCart(index: number) {
  cartStore.set((cart) => cart.filter((_, i) => i !== index));
}
export function toggleFavorite(slug: string) {
  favoritesStore.set((f) => (f.includes(slug) ? f.filter((s) => s !== slug) : [slug, ...f]));
}
export function addToLibrary(items: { slug: string; paidUsdCents: number }[]) {
  const now = Date.now();
  libraryStore.set((lib) => {
    const owned = new Set(lib.map((i) => i.slug));
    return [...items.filter((i) => !owned.has(i.slug)).map((i) => ({ ...i, at: now })), ...lib];
  });
}
export function markDownloaded(slug: string) {
  libraryStore.set((lib) => lib.map((i) => (i.slug === slug ? { ...i, downloaded: true } : i)));
}

/** Enregistre la dernière commande (bandeau de confirmation de la bibliothèque). */
export function recordOrder(order: Omit<LastOrder, "at">) {
  lastOrderStore.set({ ...order, at: Date.now() });
}
