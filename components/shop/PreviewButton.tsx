"use client";

import { play, stop, useNowPlaying } from "@/lib/client/player";
import { IconPause, IconPlay } from "@/components/ui/icons";
import { cn } from "@/components/ui/cn";

/**
 * Bouton d'extrait audio. Le son passe par le lecteur unique de l'application
 * (lib/client/player) : il continue quand on change d'écran, dans le mini-lecteur.
 */
export function PreviewButton({
  id,
  src,
  title,
  playLabel,
  pauseLabel,
}: {
  id: string;
  src?: string;
  title: string;
  playLabel: string;
  pauseLabel: string;
}) {
  const now = useNowPlaying();
  const playing = now?.id === id;

  function toggle() {
    if (playing) stop();
    else play({ id, title }, src);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? pauseLabel : playLabel}
      aria-pressed={playing}
      className={cn(
        "relative grid size-11 shrink-0 place-items-center rounded-[6px] transition-colors",
        playing ? "bg-success-soft text-success" : "bg-surface-2 text-primary-text hover:bg-line",
      )}
    >
      {playing ? <IconPause size={16} /> : <IconPlay size={16} />}
      {playing ? (
        <span aria-hidden="true" className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1 animate-beat bg-success"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
      ) : null}
    </button>
  );
}
