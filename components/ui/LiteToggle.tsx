"use client";

import { useState, useSyncExternalStore } from "react";
import { IconLeaf } from "./icons";

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const isLite = () => document.documentElement.hasAttribute("data-lite");

/**
 * Mode « données légères » : images basse résolution, pas d'autoplay.
 * Activé d'office si le navigateur signale `saveData` (voir le script d'amorçage).
 */
export function LiteToggle({ label, onText, offText }: { label: string; onText: string; offText: string }) {
  const lite = useSyncExternalStore(subscribe, isLite, () => false);
  const [announce, setAnnounce] = useState("");

  function toggle() {
    const next = !lite;
    const root = document.documentElement;
    if (next) root.setAttribute("data-lite", "");
    else root.removeAttribute("data-lite");
    try {
      localStorage.setItem("ds-lite", next ? "1" : "0");
    } catch {
      /* ignoré */
    }
    setAnnounce(next ? onText : offText);
    listeners.forEach((l) => l());
  }

  return (
    <>
      <button
        type="button"
        role="switch"
        aria-checked={lite}
        onClick={toggle}
        className="inline-flex min-h-11 items-center gap-2 px-2 text-sm font-medium text-fg rounded-[var(--radius-control)] hover:bg-surface-2"
      >
        <IconLeaf size={18} />
        <span className="sr-only sm:not-sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={`relative inline-block h-5 w-9 shrink-0 rounded-full border-2 transition-colors ${lite ? "border-fleuve bg-fleuve" : "border-line"}`}
        >
          <span
            className={`absolute left-0 top-0.5 size-3 rounded-full bg-fg transition-transform ${lite ? "translate-x-4.5" : "translate-x-0.5"}`}
          />
        </span>
      </button>
      <span className="sr-only" aria-live="polite">
        {announce}
      </span>
    </>
  );
}
