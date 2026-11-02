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
      <legend className="mb-2 text-sm font-medium">
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
              "min-h-11 flex-1 border-2 px-2 text-sm font-medium rounded-[var(--radius-control)]",
              i === index ? "border-fg bg-fg text-bg" : "border-line hover:border-fg",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted">
        {sizeLabel} : <span className="font-mono text-fg">{cur.size}</span>
      </p>
    </fieldset>
  );
}
