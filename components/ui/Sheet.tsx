"use client";

import { useRef, type ReactNode } from "react";
import { buttonClasses, type ButtonVariant } from "./Button";
import { IconClose } from "./icons";

/**
 * Feuille modale (bas d'écran sur mobile). Repose sur <dialog> natif :
 * piège du focus, touche Échap et fond assombri gérés par le navigateur.
 */
export function Sheet({
  triggerLabel,
  triggerVariant = "secondary",
  title,
  closeLabel,
  children,
}: {
  triggerLabel: string;
  triggerVariant?: ButtonVariant;
  title: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = `sheet-${title.replace(/\W+/g, "-").toLowerCase()}`;

  return (
    <>
      <button
        type="button"
        className={buttonClasses({ variant: triggerVariant })}
        onClick={() => ref.current?.showModal()}
      >
        {triggerLabel}
      </button>
      <dialog
        ref={ref}
        aria-labelledby={titleId}
        onClick={(e) => {
          if (e.target === ref.current) ref.current.close();
        }}
        className="m-0 mt-auto w-full max-w-none border-t-4 border-fg bg-bg p-0 text-fg backdrop:bg-ink/70 sm:m-auto sm:max-w-md sm:border-4"
      >
        <div className="flex flex-col gap-4 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="text-2xl font-bold">
              {title}
            </h2>
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => ref.current?.close()}
              className="-m-2 grid size-11 shrink-0 place-items-center hover:bg-surface-2"
            >
              <IconClose size={20} />
            </button>
          </div>
          {children}
        </div>
      </dialog>
    </>
  );
}
