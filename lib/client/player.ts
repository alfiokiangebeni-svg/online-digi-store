"use client";

import { useSyncExternalStore } from "react";

/**
 * Lecteur audio unique de l'application : il survit aux changements d'écran
 * (mini-lecteur persistant en bas). Démo : mélodie synthétisée à partir du titre
 * (Web Audio, aucun fichier) ; avec `src`, lit le vrai extrait.
 */
export interface NowPlaying {
  id: string;
  title: string;
}

let current: NowPlaying | null = null;
let stopFn: (() => void) | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

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
  const notes = 120; // environ 30 s, comme un vrai extrait
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

export function stop() {
  const fn = stopFn;
  stopFn = null;
  current = null;
  fn?.();
  emit();
}

export function play(item: NowPlaying, src?: string) {
  if (stopFn) {
    const fn = stopFn;
    stopFn = null;
    fn();
  }
  current = item;
  const ended = () => {
    if (current?.id === item.id) {
      current = null;
      stopFn = null;
      emit();
    }
  };
  if (src) {
    const audio = new Audio(src);
    audio.play().catch(ended);
    audio.addEventListener("ended", ended);
    stopFn = () => audio.pause();
  } else {
    stopFn = playTune(item.id + item.title, ended);
  }
  emit();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useNowPlaying(): NowPlaying | null {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}
