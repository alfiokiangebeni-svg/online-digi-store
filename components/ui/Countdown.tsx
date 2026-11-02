"use client";

import { useState, useSyncExternalStore } from "react";
import { nextFridayNight } from "@/lib/time";
import { cn } from "./cn";

/**
 * Horloge à la seconde, créée par instance. Elle ne lit l'heure que dans le
 * navigateur (abonnement / instantané), jamais pendant le rendu serveur.
 */
function createClock() {
  const clock = {
    startedAt: null as number | null,
    subscribe(onTick: () => void) {
      clock.startedAt ??= Date.now();
      const t = setInterval(onTick, 1000);
      onTick();
      return () => clearInterval(t);
    },
    snapshot: () => (clock.startedAt === null ? null : Math.floor(Date.now() / 1000)),
    serverSnapshot: () => null,
  };
  return clock;
}

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, "0"));
}

/** Compteur de vente flash ; il « bat » pendant la dernière minute. */
export function Countdown({
  endsAt: endsAtProp,
  durationMs,
  until,
  label,
  endedLabel,
}: {
  /** Horodatage de fin (ms depuis l'époque Unix)… */
  endsAt?: number;
  /** …ou durée à partir de l'affichage (démonstration)… */
  durationMs?: number;
  /** …ou échéance récurrente : vendredi 23 h 59, heure de Kinshasa. */
  until?: "friday";
  label: string;
  endedLabel: string;
}) {
  const [clock] = useState(createClock);
  const nowSec = useSyncExternalStore(clock.subscribe, clock.snapshot, clock.serverSnapshot);
  const now = nowSec === null ? null : nowSec * 1000;
  const start = clock.startedAt ?? 0;
  const endsAt = endsAtProp ?? (until === "friday" ? nextFridayNight(start) : start + (durationMs ?? 0));

  const remaining = now === null ? null : endsAt - now;
  const ended = remaining !== null && remaining <= 0;
  const lastMinute = remaining !== null && remaining > 0 && remaining <= 60_000;
  const [h, m, s] = remaining === null ? ["--", "--", "--"] : split(remaining);

  return (
    <p className="inline-flex items-center gap-2 rounded-[6px] bg-promo px-2.5 py-1 text-xs font-semibold text-on-primary">
      <span>{ended ? endedLabel : label}</span>
      {!ended ? (
        <time
          dateTime={`PT${h}H${m}M${s}S`}
          className={cn("inline-block min-w-[9ch] font-bold tabular-nums", lastMinute && "animate-beat")}
        >
          {h}:{m}:{s}
        </time>
      ) : null}
    </p>
  );
}
