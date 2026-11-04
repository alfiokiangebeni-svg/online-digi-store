"use client";

import { useSyncExternalStore } from "react";

/**
 * Retours d'action : chaque bouton important confirme ce qu'il a fait
 * (« Ajouté au panier · Voir le panier »), ou explique l'erreur avec « Réessayer ».
 */
export interface ToastItem {
  id: number;
  tone: "success" | "error" | "info";
  message: string;
  action?: { label: string; href?: string; onClick?: () => void };
}

let items: ToastItem[] = [];
let next = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function toast(t: Omit<ToastItem, "id">, durationMs = 3500) {
  const id = next++;
  items = [...items.slice(-1), { ...t, id }];
  emit();
  setTimeout(() => dismiss(id), durationMs);
  return id;
}

export function dismiss(id: number) {
  items = items.filter((t) => t.id !== id);
  emit();
}

const EMPTY: ToastItem[] = [];
export function useToasts(): ToastItem[] {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => items,
    () => EMPTY,
  );
}
