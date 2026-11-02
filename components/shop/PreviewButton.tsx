"use client";

import { useEffect, useRef, useState } from "react";
import { IconPause, IconPlay } from "@/components/ui/icons";
import { cn } from "@/components/ui/cn";

/**
 * Extrait audio. Avec `src`, lit le fichier d'aperçu (30 s, servi par R2 en phase 3).
 * Sans `src` (catalogue de démo), joue une courte mélodie synthétisée (Web Audio),
 * dérivée du titre : aucun fichier téléchargé.
 */
let stopCurrent: (() => void) | null = null;

function seedFrom(text: string) {
  let h = 2166136261;
  for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507)), (h >>> 0) / 4294967296);
}

function playTune(seed: string, onEnd: () => void): () => void {
  const Ctx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new Ctx();
  const rand = seedFrom(seed);
  const scale = [0, 2, 4, 7, 9, 12, 14, 16]; // pentatonique majeure
  const root = 220 * 2 ** (Math.floor(rand() * 5) / 12);
  const beat = 0.24;
  const master = ctx.createGain();
  master.gain.value = 0.18;
  master.connect(ctx.destination);
  const notes = 32;
  for (let i = 0; i < notes; i++) {
    const t = ctx.currentTime + 0.05 + i * beat;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = i % 4 === 0 ? "triangle" : "sine";
    osc.frequency.value =
      root * 2 ** (scale[Math.floor(rand() * scale.length)] / 12) * (i % 8 === 0 ? 0.5 : 1);
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(1, t + 0.02);
    env.gain.exponentialRampToValueAtTime(0.001, t + beat * 1.6);
    osc.connect(env).connect(master);
    osc.start(t);
    osc.stop(t + beat * 1.7);
  }
  const timer = setTimeout(stop, (notes * beat + 0.5) * 1000);
  function stop() {
    clearTimeout(timer);
    ctx.close().catch(() => {});
    onEnd();
  }
  return stop;
}

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
  const [playing, setPlaying] = useState(false);
  const mine = useRef<(() => void) | null>(null);
  // Coupe le son si le composant disparaît (changement de page).
  useEffect(() => () => mine.current?.(), []);

  function toggle() {
    if (playing) {
      stopCurrent?.();
      return;
    }
    stopCurrent?.();
    const done = () => {
      setPlaying(false);
      stopCurrent = null;
      mine.current = null;
    };
    if (src) {
      const audio = new Audio(src);
      audio.play().catch(done);
      audio.addEventListener("ended", done);
      stopCurrent = () => {
        audio.pause();
        done();
      };
    } else {
      stopCurrent = playTune(id + title, done);
    }
    mine.current = stopCurrent;
    setPlaying(true);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? pauseLabel : playLabel}
      aria-pressed={playing}
      className={cn(
        "relative grid size-11 shrink-0 place-items-center rounded-[6px] transition-colors",
        playing ? "bg-success text-on-primary" : "btn-primary",
      )}
    >
      {playing ? <IconPause size={16} /> : <IconPlay size={16} />}
      {playing ? (
        <span aria-hidden="true" className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1 animate-beat bg-on-primary"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
      ) : null}
    </button>
  );
}
