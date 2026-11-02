"use client";

import { useSyncExternalStore } from "react";
import { IconMoon, IconSun } from "./icons";

type Theme = "dark" | "light";

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/** Bascule mode sombre (défaut) / clair. Préférence gardée sur l'appareil. */
export function ThemeToggle({ toLight, toDark }: { toLight: string; toDark: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);
  const next: Theme = theme === "dark" ? "light" : "dark";
  const label = next === "light" ? toLight : toDark;

  function toggle() {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("ds-theme", next);
    } catch {
      /* stockage indisponible : la préférence ne dure que la session */
    }
    listeners.forEach((l) => l());
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid size-11 place-items-center text-fg rounded-[var(--radius-control)] hover:bg-surface-2"
    >
      {theme === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />}
    </button>
  );
}
