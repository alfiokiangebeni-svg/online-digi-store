"use client";

import { useState } from "react";
import { setLite, useLite } from "@/lib/client/prefs";
import { Switch } from "./Switch";
import { IconLeaf } from "./icons";

/**
 * Mode « données légères » : images basse résolution, pas d'autoplay.
 * Activé d'office si le navigateur signale `saveData` (voir le script d'amorçage).
 */
export function LiteToggle({
  label,
  hint,
  onText,
  offText,
}: {
  label: string;
  hint?: string;
  onText: string;
  offText: string;
}) {
  const lite = useLite();
  const [announce, setAnnounce] = useState("");
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <IconLeaf size={20} className="mt-0.5 shrink-0 text-success" />
        <div>
          <p id="lite-label" className="font-medium">
            {label}
          </p>
          {hint ? <p className="text-sm text-muted">{hint}</p> : null}
        </div>
      </div>
      <Switch
        checked={lite}
        labelledBy="lite-label"
        onChange={(next) => {
          setLite(next);
          setAnnounce(next ? onText : offText);
        }}
      />
      <span className="sr-only" aria-live="polite">
        {announce}
      </span>
    </div>
  );
}
