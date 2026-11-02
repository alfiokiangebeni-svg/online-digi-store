"use client";

import { useState } from "react";
import { cn } from "@/components/ui/cn";

/** Choix de la version (Android, Windows, navigateur) : nom complet et taille du téléchargement. */
export function PlatformPicker({
  label,
  sizeLabel,
  options,
}: {
  label: string;
  sizeLabel: string;
  options: { id: string; label: string; name: string; size: string }[];
}) {
  const [index, setIndex] = useState(0);
  const cur = options[index];
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-semibold">
        {label} <span className="font-normal text-muted">{cur.name}</span>
      </legend>
      <div className="flex gap-2">
        {options.map((o, i) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              "min-h-10 flex-1 rounded-[6px] bg-surface px-2 text-[13px] font-medium",
              i === index ? "border-2 border-fg" : "border border-steel hover:border-fg",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted">
        {sizeLabel} : <span className="font-semibold text-fg">{cur.size}</span>
      </p>
    </fieldset>
  );
}
