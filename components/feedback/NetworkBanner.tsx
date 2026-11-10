"use client";

import { useSyncExternalStore } from "react";
import { IconClose } from "@/components/ui/icons";

function subscribe(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}

/**
 * Bandeau « Hors connexion » : explicite ce qui marche (catalogue, panier, achats)
 * et ce qui attend le réseau (partage, WhatsApp) ; « Réessayer » recharge la page.
 */
export function NetworkBanner({ text, retry }: { text: string; retry: string }) {
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
  if (online) return null;
  return (
    <div
      role="alert"
      className="flex items-center gap-3 border-b border-line bg-surface-2 px-4 py-2 text-xs text-fg"
    >
      <IconClose size={14} className="shrink-0 text-urgent-text" />
      <p className="flex-1">{text}</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="shrink-0 py-1.5 font-semibold text-primary-text"
      >
        {retry}
      </button>
    </div>
  );
}
