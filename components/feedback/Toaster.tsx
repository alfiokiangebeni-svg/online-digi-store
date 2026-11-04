"use client";

import Link from "next/link";
import { dismiss, useToasts } from "@/lib/client/toast";
import { IconCheck, IconClose } from "@/components/ui/icons";
import { cn } from "@/components/ui/cn";

/** Zone des retours d'action, au-dessus de la barre du bas ; annoncée aux lecteurs d'écran. */
export function Toaster({ closeLabel }: { closeLabel: string }) {
  const list = useToasts();
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-50 flex flex-col items-center gap-2 px-3"
    >
      {list.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex w-full max-w-md animate-toast-in items-center gap-3 rounded-[var(--radius-lg)] border border-line bg-surface-2 px-3 py-2.5 text-sm text-fg"
        >
          <span
            className={cn(
              "shrink-0",
              t.tone === "error" ? "text-urgent-text" : t.tone === "success" ? "text-success" : "text-muted",
            )}
          >
            {t.tone === "error" ? <IconClose size={18} /> : <IconCheck size={18} />}
          </span>
          <p className="flex-1">{t.message}</p>
          {t.action ? (
            t.action.href ? (
              <Link
                href={t.action.href}
                prefetch={false}
                onClick={() => dismiss(t.id)}
                className="shrink-0 py-2 font-semibold text-primary-text"
              >
                {t.action.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  t.action?.onClick?.();
                  dismiss(t.id);
                }}
                className="shrink-0 py-2 font-semibold text-primary-text"
              >
                {t.action.label}
              </button>
            )
          ) : null}
          <button
            type="button"
            aria-label={closeLabel}
            onClick={() => dismiss(t.id)}
            className="-my-1 grid size-9 shrink-0 place-items-center text-muted"
          >
            <IconClose size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
