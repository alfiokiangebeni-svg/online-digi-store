"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

/**
 * « Réessayer » de la page hors-ligne : recharge la page DEMANDÉE (le service worker
 * sert la page hors-ligne à l'adresse d'origine) et le fait tout seul quand le réseau revient.
 */
export function RetryButton({ label }: { label: string }) {
  useEffect(() => {
    const onOnline = () => window.location.reload();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, []);
  return (
    <Button variant="outline" onClick={() => window.location.reload()}>
      {label}
    </Button>
  );
}
