"use client";

import { useRef, useState } from "react";
import type { CategoryId } from "@/lib/theme";
import { TicketCover } from "@/components/ui/Ticket";
import { IconBack, IconChevron, IconClose } from "@/components/ui/icons";
import { cn } from "@/components/ui/cn";

/**
 * Galerie d'aperçus de la fiche produit : chaque vignette s'ouvre en grand
 * (fenêtre native, touche retour et Échap gérées), avec précédent / suivant.
 * En mode données légères, seule la première vignette est affichée.
 */
export function PreviewGallery({
  slides,
  category,
  watermark,
  labels,
}: {
  slides: string[];
  category?: CategoryId;
  /** Filigrane posé sur les aperçus (images vendues : « di.si store · aperçu »). */
  watermark?: string;
  labels: { open: string; prev: string; next: string; close: string; counter: string };
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const go = (i: number) => setIndex((i + slides.length) % slides.length);

  return (
    <>
      <ul data-gallery className="scroll-rail flex overflow-x-auto bg-surface">
        {slides.map((title, i) => (
          <li key={i} className={cn("relative w-full shrink-0", i > 0 && "lite-hide")}>
            <button
              type="button"
              aria-label={labels.open.replace("{n}", String(i + 1))}
              onClick={() => {
                setIndex(i);
                ref.current?.showModal();
              }}
              className="block w-full text-left [&_.cover]:aspect-[4/3] [&_.cover]:p-5 [&_.cover-title]:text-3xl"
            >
              <TicketCover title={title} category={category} />
              {watermark ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 grid place-items-center text-2xl font-extrabold uppercase tracking-widest text-fg/25 [transform:rotate(-24deg)]"
                >
                  {watermark}
                </span>
              ) : null}
              <span className="absolute bottom-3 right-3 rounded-full bg-background px-2 py-0.5 text-xs text-fg">
                {labels.counter.replace("{n}", String(i + 1)).replace("{total}", String(slides.length))}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={ref}
        aria-label={labels.counter
          .replace("{n}", String(index + 1))
          .replace("{total}", String(slides.length))}
        onClick={(e) => e.target === ref.current && ref.current.close()}
        className="m-auto w-full max-w-lg bg-transparent p-3 backdrop:bg-scrim-strong"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm text-on-accent">
            <span>
              {labels.counter.replace("{n}", String(index + 1)).replace("{total}", String(slides.length))}
            </span>
            <button
              type="button"
              aria-label={labels.close}
              onClick={() => ref.current?.close()}
              className="pressable grid size-11 place-items-center rounded-full bg-surface-2"
            >
              <IconClose size={18} />
            </button>
          </div>
          <div className="relative overflow-hidden rounded-[var(--radius-lg)] [&_.cover]:aspect-[3/4] [&_.cover]:p-6 [&_.cover-title]:text-4xl">
            <TicketCover title={slides[index]} category={category} />
            {watermark ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 grid place-items-center text-3xl font-extrabold uppercase tracking-widest text-fg/25 [transform:rotate(-24deg)]"
              >
                {watermark}
              </span>
            ) : null}
          </div>
          {slides.length > 1 ? (
            <div className="flex justify-between">
              <button
                type="button"
                aria-label={labels.prev}
                onClick={() => go(index - 1)}
                className="pressable grid size-12 place-items-center rounded-full bg-surface-2 text-fg"
              >
                <IconBack size={20} />
              </button>
              <button
                type="button"
                aria-label={labels.next}
                onClick={() => go(index + 1)}
                className="pressable grid size-12 place-items-center rounded-full bg-surface-2 text-fg"
              >
                <IconChevron size={20} />
              </button>
            </div>
          ) : null}
        </div>
      </dialog>
    </>
  );
}
