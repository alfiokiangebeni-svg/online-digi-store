"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { IconMic, IconScan } from "@/components/ui/icons";
import { cn } from "@/components/ui/cn";
import { canScan, canVoice, startScan, startVoice } from "@/lib/client/native";
import { toast } from "@/lib/client/toast";
import { format } from "@/lib/i18n/format";

export interface SearchToolsLabels {
  voice: string;
  scan: string;
  listening: string;
  voiceFailed: string;
  scanFailed: string;
  scanned: string;
  retry: string;
}

const noop = () => () => {};

/**
 * Recherche vocale et scan, à droite de la barre de recherche. Affichés seulement
 * quand le téléphone les prend en charge (micro du navigateur, ou application Android).
 */
export function SearchTools({
  exploreHref,
  lang,
  labels: t,
}: {
  exploreHref: string;
  lang: string;
  labels: SearchToolsLabels;
}) {
  const router = useRouter();
  const voice = useSyncExternalStore(noop, canVoice, () => false);
  const scan = useSyncExternalStore(noop, canScan, () => false);
  const [listening, setListening] = useState(false);

  const search = (q: string) => router.push(`${exploreHref}?q=${encodeURIComponent(q.trim())}`);

  function onVoice() {
    setListening(true);
    toast({ tone: "info", message: t.listening });
    startVoice(
      lang,
      (text) => {
        setListening(false);
        search(text);
      },
      (reason) => {
        setListening(false);
        if (reason === "cancelled" || reason === "aborted") return;
        toast({ tone: "error", message: t.voiceFailed, action: { label: t.retry, onClick: onVoice } });
      },
    );
  }

  function onScan() {
    startScan(
      (text) => {
        // Lien di.si store (fiche ou annonce) : ouvert dans l'application ; sinon, recherche.
        const m = text.match(/\/(fr|ln|en)\/(produit|annonce)\/([a-z0-9-]+)/);
        if (m) router.push(`/${m[1]}/${m[2]}/${m[3]}`);
        else {
          toast({ tone: "success", message: format(t.scanned, { code: text }) });
          search(text);
        }
      },
      (reason) => {
        if (reason === "cancelled") return;
        toast({ tone: "error", message: t.scanFailed, action: { label: t.retry, onClick: onScan } });
      },
    );
  }

  const btn =
    "grid size-9 shrink-0 place-items-center rounded-[var(--radius-sm)] text-muted hover:bg-surface hover:text-fg";
  return (
    <>
      {voice ? (
        <button
          type="button"
          aria-label={t.voice}
          aria-pressed={listening}
          onClick={onVoice}
          className={cn(btn, listening && "animate-beat text-primary")}
        >
          <IconMic size={20} />
        </button>
      ) : null}
      {scan ? (
        <button type="button" aria-label={t.scan} onClick={onScan} className={btn}>
          <IconScan size={20} />
        </button>
      ) : null}
    </>
  );
}
