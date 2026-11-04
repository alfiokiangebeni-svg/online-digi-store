"use client";

import { useSyncExternalStore } from "react";
import type { Currency } from "@/lib/currency";

/**
 * Préférences portées par des attributs de <html> (posés avant le rendu par le
 * script d'amorçage) : le serveur rend les deux devises, le CSS masque l'autre.
 */
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const notify = () => listeners.forEach((l) => l());

function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignoré */
  }
}

export function useCurrency(): Currency {
  return useSyncExternalStore(
    subscribe,
    () => (document.documentElement.dataset.currency === "CDF" ? "CDF" : "USD"),
    () => "USD" as Currency,
  );
}
export function setCurrency(c: Currency) {
  document.documentElement.dataset.currency = c;
  save("ds-currency", c);
  notify();
}

export function useLite(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.hasAttribute("data-lite"),
    () => false,
  );
}
export function setLite(on: boolean) {
  if (on) document.documentElement.setAttribute("data-lite", "");
  else document.documentElement.removeAttribute("data-lite");
  save("ds-lite", on ? "1" : "0");
  notify();
}
