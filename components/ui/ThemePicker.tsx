"use client";

import { setTheme, useTheme } from "@/lib/client/prefs";
import { toast } from "@/lib/client/toast";
import { THEME_IDS, type ThemeChoice } from "@/lib/theme";
import { cn } from "./cn";
import { IconCheck } from "./icons";

/** Aperçu d'un thème : ses vraies couleurs, grâce à l'attribut data-theme posé sur l'aperçu. */
function Preview({ id }: { id: string }) {
  return (
    <span data-theme={id} className="flex h-full w-full flex-col gap-1 bg-background p-1.5">
      <span className="h-2 w-8 rounded-full bg-primary" />
      <span className="flex flex-1 gap-1">
        <span className="flex-1 rounded-[4px] border border-line bg-surface" />
        <span className="flex-1 rounded-[4px] bg-terre-soft" />
      </span>
      <span className="h-2.5 rounded-[4px] bg-[linear-gradient(100deg,var(--color-primary-light),var(--color-primary)_70%)]" />
    </span>
  );
}

/** Sélecteur de thème : Automatique + 6 thèmes, chacun avec son aperçu. */
export function ThemePicker({
  label,
  names,
  hint,
  saved,
}: {
  label: string;
  names: Record<ThemeChoice, string>;
  hint: string;
  saved: string;
}) {
  const current = useTheme();
  const choices: ThemeChoice[] = ["auto", ...THEME_IDS];
  return (
    <div className="flex flex-col gap-2">
      <div role="radiogroup" aria-label={label} className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {choices.map((c) => {
          const on = current === c;
          return (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={names[c]}
              onClick={() => {
                setTheme(c);
                toast({ tone: "success", message: `${saved} : ${names[c]}` });
              }}
              className="pressable flex flex-col items-center gap-1 text-[11px] font-medium"
            >
              <span
                className={cn(
                  "relative block aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-sm)] border",
                  on ? "border-primary shadow-[0_0_0_2px_var(--color-primary)]" : "border-line",
                )}
              >
                {c === "auto" ? (
                  <span className="flex h-full">
                    <span className="w-1/2 overflow-hidden">
                      <Preview id="light" />
                    </span>
                    <span className="w-1/2 overflow-hidden">
                      <Preview id="dark" />
                    </span>
                  </span>
                ) : (
                  <Preview id={c} />
                )}
                {on ? (
                  <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-primary text-on-primary">
                    <IconCheck size={10} />
                  </span>
                ) : null}
              </span>
              <span className={on ? "font-semibold text-fg" : "text-muted"}>{names[c]}</span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted">{hint}</p>
    </div>
  );
}
