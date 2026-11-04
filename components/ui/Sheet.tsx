"use client";

import { useId, useRef, type ReactNode } from "react";
import { cn } from "./cn";
import { buttonClasses, type ButtonVariant } from "./Button";
import { IconClose } from "./icons";

/**
 * Feuille modale (bas d'écran sur mobile). Repose sur <dialog> natif :
 * piège du focus, touche Échap et fond assombri gérés par le navigateur.
 */
export function Sheet({
  triggerLabel,
  triggerVariant = "secondary",
  triggerIcon,
  triggerClassName,
  triggerIconOnly,
  title,
  closeLabel,
  children,
}: {
  triggerLabel: string;
  triggerVariant?: ButtonVariant;
  triggerIcon?: ReactNode;
  triggerClassName?: string;
  /** Bouton déclencheur réduit à l'icône (le libellé reste lu par les lecteurs d'écran). */
  triggerIconOnly?: boolean;
  title: string;
  closeLabel: string;
  /** Contenu, ou fonction recevant `close` pour fermer après une action. */
  children: ReactNode | ((close: () => void) => ReactNode);
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const uid = useId();
  const titleId = `${uid}-title`;
  const dialogId = `${uid}-dialog`;
  // Fermeture par identifiant (et non par ref) : utilisable par le contenu.
  const close = () => (document.getElementById(dialogId) as HTMLDialogElement | null)?.close();

  return (
    <>
      <button
        type="button"
        className={cn(buttonClasses({ variant: triggerVariant }), triggerClassName)}
        onClick={() => ref.current?.showModal()}
      >
        {triggerIcon}
        {triggerIconOnly ? <span className="sr-only">{triggerLabel}</span> : triggerLabel}
      </button>
      <dialog
        ref={ref}
        id={dialogId}
        aria-labelledby={titleId}
        onClick={(e) => {
          if (e.target === ref.current) ref.current.close();
        }}
        className="m-0 mt-auto w-full max-w-none rounded-t-[var(--radius-lg)] border-t border-line bg-surface p-0 text-fg backdrop:bg-fg/50 sm:m-auto sm:max-w-md sm:rounded-[var(--radius-lg)]"
      >
        <div className="flex flex-col gap-4 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="text-lg font-bold">
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
          {typeof children === "function" ? children(close) : children}
        </div>
      </dialog>
    </>
  );
}
