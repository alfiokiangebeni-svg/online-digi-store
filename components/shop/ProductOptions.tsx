"use client";

import type { ReactNode } from "react";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/components/ui/cn";
import { IconCart, IconCheck, IconImage, IconLock, IconPlus } from "@/components/ui/icons";
import { haptic } from "@/lib/client/haptics";
import {
  addToCart,
  chooseOption,
  optionStore,
  parentalStore,
  playlistStore,
  togglePlaylist,
} from "@/lib/client/shop";
import { useStore } from "@/lib/client/store";
import { toast } from "@/lib/client/toast";
import { allowedForAge } from "@/lib/catalog";
import { format } from "@/lib/i18n/format";
import { PreviewButton } from "./PreviewButton";

export interface OptionChoice {
  value: string;
  label: string;
  /** Libellé enregistré avec la ligne de panier (« Format : EPUB »). */
  cartLabel: string;
  hint?: string;
  price?: ReactNode;
}

/** Option actuellement choisie pour la fiche (sinon la première proposée). */
export function useChosen(slug: string, choices: OptionChoice[]) {
  const chosen = useStore(optionStore)[slug];
  return choices.find((c) => c.value === chosen?.option) ?? choices[0];
}

/** Choix du format (livres) : puces. */
export function FormatPicker({
  slug,
  label,
  choices,
}: {
  slug: string;
  label: string;
  choices: OptionChoice[];
}) {
  const current = useChosen(slug, choices);
  return (
    <div role="group" aria-label={label} className="flex flex-col gap-2">
      <span className="text-[13px] font-medium text-muted">{label}</span>
      <div className="flex flex-wrap gap-2">
        {choices.map((c) => (
          <Chip
            key={c.value}
            selected={current.value === c.value}
            onClick={() => chooseOption(slug, c.value, c.cartLabel)}
          >
            {c.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

/** Choix de la licence (images) : cartes radio avec prix et usage autorisé. */
export function LicensePicker({
  slug,
  label,
  choices,
}: {
  slug: string;
  label: string;
  choices: OptionChoice[];
}) {
  const current = useChosen(slug, choices);
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-col gap-2">
      <span className="text-[13px] font-medium text-muted">{label}</span>
      {choices.map((c) => {
        const on = current.value === c.value;
        return (
          <button
            key={c.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => chooseOption(slug, c.value, c.cartLabel)}
            className={cn(
              "flex items-center gap-3 rounded-[var(--radius-sm)] border p-3 text-left",
              on ? "border-primary bg-surface-2" : "border-line hover:bg-surface-2",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "grid size-5 shrink-0 place-items-center rounded-full border-2",
                on ? "border-primary bg-primary text-on-primary" : "border-muted",
              )}
            >
              {on ? <IconCheck size={12} /> : null}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm font-semibold">{c.label}</span>
              {c.hint ? <span className="text-xs text-muted">{c.hint}</span> : null}
            </span>
            {c.price ? <span className="shrink-0 text-sm font-bold">{c.price}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

export interface TrackLabels {
  listen: string;
  pause: string;
  buyTrack: string;
  addPlaylist: string;
  removePlaylist: string;
  playlistAdded: string;
  playlistRemoved: string;
  trackAdded: string;
  trackLabel: string;
  viewCart: string;
}

/** Titres d'un album : extrait, ajout à la playlist, achat du titre seul. */
export function TrackList({
  slug,
  tracks,
  price,
  cartHref,
  labels: t,
}: {
  slug: string;
  tracks: { title: string; duration: string }[];
  price: ReactNode;
  cartHref: string;
  labels: TrackLabels;
}) {
  const playlist = useStore(playlistStore);
  return (
    <ol className="flex flex-col">
      {tracks.map((tr, i) => {
        const id = `${slug}#${i + 1}`;
        const inList = playlist.some((p) => p.id === id);
        return (
          <li
            key={id}
            className="flex min-h-14 items-center gap-2 border-b border-line py-1.5 last:border-b-0"
          >
            <PreviewButton
              id={id}
              title={tr.title}
              playLabel={format(t.listen, { title: tr.title })}
              pauseLabel={t.pause}
            />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-semibold">
                {i + 1}. {tr.title}
              </span>
              <span className="text-xs text-muted">
                {tr.duration} · {price}
              </span>
            </span>
            <button
              type="button"
              aria-pressed={inList}
              aria-label={`${inList ? t.removePlaylist : t.addPlaylist} — ${tr.title}`}
              onClick={() => {
                const added = togglePlaylist({ id, slug, title: tr.title });
                toast({ tone: "success", message: added ? t.playlistAdded : t.playlistRemoved });
              }}
              className={cn(
                "grid size-11 shrink-0 place-items-center rounded-[var(--radius-sm)] hover:bg-surface-2",
                inList ? "text-primary" : "text-muted",
              )}
            >
              {inList ? <IconCheck size={18} /> : <IconPlus size={18} />}
            </button>
            <button
              type="button"
              aria-label={`${t.buyTrack} — ${tr.title}`}
              onClick={() => {
                haptic();
                addToCart({
                  slug,
                  option: `track:${i + 1}`,
                  optionLabel: format(t.trackLabel, { title: tr.title }),
                });
                toast({
                  tone: "success",
                  message: t.trackAdded,
                  action: { label: t.viewCart, href: cartHref },
                });
              }}
              className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-sm)] border border-line hover:bg-surface-2"
            >
              <IconCart size={18} />
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/** « Voir les captures » : ouvre la galerie d'aperçus en grand. */
export function ScreenshotsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => document.querySelector<HTMLButtonElement>("[data-gallery] button")?.click()}
      className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-line px-3 text-sm font-semibold hover:bg-surface-2"
    >
      <IconImage size={18} />
      {label}
    </button>
  );
}

/** Contrôle parental : avertit quand l'âge conseillé dépasse le réglage. */
export function ParentalNotice({
  age,
  blocked,
  ok,
}: {
  age?: [number, number];
  blocked: string;
  ok: string;
}) {
  const parental = useStore(parentalStore);
  if (!parental.enabled || !age) return null;
  const allowed = allowedForAge({ age }, parental.maxAge);
  return (
    <p
      role="status"
      className={cn(
        "flex items-start gap-2 rounded-[var(--radius-sm)] bg-surface-2 px-3 py-2.5 text-sm",
        allowed ? "text-success" : "text-urgent-text",
      )}
    >
      <IconLock size={16} className="mt-0.5 shrink-0" />
      {format(allowed ? ok : blocked, { age: parental.maxAge })}
    </p>
  );
}

/** Compte › Ma playlist : écoute, retrait. */
export function PlaylistView({
  title,
  empty,
  labels,
}: {
  title: string;
  empty: string;
  labels: { listen: string; pause: string; remove: string; removed: string };
}) {
  const list = useStore(playlistStore);
  return (
    <section aria-labelledby="playlist-title" className="card p-3.5">
      <h2 id="playlist-title" className="text-[15px] font-semibold">
        {title}
      </h2>
      {list.length ? (
        <ul className="mt-2">
          {list.map((p) => (
            <li key={p.id} className="flex min-h-14 items-center gap-3 border-b border-line last:border-b-0">
              <PreviewButton
                id={p.id}
                title={p.title}
                playLabel={format(labels.listen, { title: p.title })}
                pauseLabel={labels.pause}
              />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">{p.title}</span>
              <button
                type="button"
                onClick={() => {
                  togglePlaylist(p);
                  toast({ tone: "info", message: labels.removed });
                }}
                className="min-h-11 px-2 text-xs font-semibold text-muted hover:text-fg"
              >
                {labels.remove}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-xs text-muted">{empty}</p>
      )}
    </section>
  );
}
