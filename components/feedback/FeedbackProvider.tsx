"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n";
import { NetworkBanner } from "./NetworkBanner";
import { Toaster } from "./Toaster";

export type FeedbackTexts = Dictionary["feedback"];

const Ctx = createContext<FeedbackTexts | null>(null);

/** Textes des retours d'action, disponibles pour tous les boutons de l'écran. */
export function useFeedbackTexts(): FeedbackTexts {
  const t = useContext(Ctx);
  if (!t) throw new Error("FeedbackProvider manquant");
  return t;
}

/** Posé une fois dans le gabarit : bandeau hors connexion + zone des messages. */
export function FeedbackProvider({ texts, children }: { texts: FeedbackTexts; children: ReactNode }) {
  return (
    <Ctx.Provider value={texts}>
      <NetworkBanner text={texts.offline} retry={texts.retry} />
      {children}
      <Toaster closeLabel={texts.close} />
    </Ctx.Provider>
  );
}
