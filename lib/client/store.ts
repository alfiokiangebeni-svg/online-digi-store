"use client";

import { useSyncExternalStore } from "react";

/**
 * Petit magasin persistant (localStorage) partagé entre composants client.
 * Rendu serveur et hydratation utilisent `initial` : aucune différence de HTML.
 * Phase 2 : synchronisé avec Supabase quand l'utilisateur est connecté.
 */
export interface Store<T> {
  get(): T;
  set(next: T | ((prev: T) => T)): void;
  subscribe(listener: () => void): () => void;
  initial: T;
}

export function createStore<T>(key: string, initial: T, isValid: (v: unknown) => v is T): Store<T> {
  let state: T | undefined;
  const listeners = new Set<() => void>();

  const read = (): T => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return initial;
      const parsed: unknown = JSON.parse(raw);
      return isValid(parsed) ? parsed : initial;
    } catch {
      return initial;
    }
  };

  const store: Store<T> = {
    initial,
    get() {
      if (state === undefined) state = read();
      return state;
    },
    set(next) {
      const value = typeof next === "function" ? (next as (prev: T) => T)(store.get()) : next;
      state = value;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* stockage plein ou bloqué : l'état reste en mémoire */
      }
      listeners.forEach((l) => l());
    },
    subscribe(listener) {
      listeners.add(listener);
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) {
          state = read();
          listener();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
  };
  return store;
}

export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, () => store.initial);
}
