"use client";

import { setTheme, useTheme } from "@/lib/client/prefs";
import { IconMoon, IconSun } from "./icons";

/** Bascule mode sombre (défaut) / clair. Préférence gardée sur l'appareil. */
export function ThemeToggle({ toLight, toDark }: { toLight: string; toDark: string }) {
  const theme = useTheme();
  const label = theme === "dark" ? toLight : toDark;
  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="grid size-11 place-items-center text-fg rounded-[var(--radius-control)] hover:bg-surface-2"
    >
      {theme === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />}
    </button>
  );
}
