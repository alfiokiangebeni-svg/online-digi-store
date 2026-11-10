"use client";

import { useSyncExternalStore } from "react";

/** Paramètres de l'URL comme source d'état (partageables, bouton retour). */
const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("popstate", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("popstate", cb);
  };
}

export function useSearchParam(name: string): string {
  return useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(name) ?? "",
    () => "",
  );
}

export function setSearchParams(values: Record<string, string | null>) {
  const url = new URL(window.location.href);
  for (const [k, v] of Object.entries(values)) {
    if (v) url.searchParams.set(k, v);
    else url.searchParams.delete(k);
  }
  window.history.replaceState(window.history.state, "", url);
  listeners.forEach((l) => l());
}
