"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { IconBack } from "@/components/ui/icons";

const KEY = "ds-depth";

/** Compte les écrans visités dans l'onglet / l'application (sessionStorage). */
export function NavDepthTracker() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, String(Number(sessionStorage.getItem(KEY) ?? "0") + 1));
    } catch {
      /* stockage indisponible */
    }
  }, [pathname]);
  return null;
}

/**
 * « Retour » : revient à l'écran précédent de la boutique. Si la page a été ouverte
 * directement (lien partagé, premier écran), va à `fallback` (l'accueil).
 */
export function BackButton({ fallback, label }: { fallback: string; label: string }) {
  const router = useRouter();
  return (
    <Link
      href={fallback}
      aria-label={label}
      onClick={(e) => {
        let depth = 0;
        try {
          depth = Number(sessionStorage.getItem(KEY) ?? "0");
        } catch {
          /* ignoré */
        }
        if (depth > 1 && window.history.length > 1) {
          e.preventDefault();
          router.back();
        }
      }}
      className="pressable -ml-2 grid size-11 place-items-center rounded-[var(--radius-sm)] hover:bg-surface-2"
    >
      <IconBack />
    </Link>
  );
}
