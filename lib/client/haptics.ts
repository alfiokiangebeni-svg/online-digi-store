/**
 * Légère vibration pour les actions d'achat (Acheter, Payer, Postuler…).
 * Ignorée si le téléphone ne la gère pas ou si l'utilisateur réduit les animations.
 * L'APK déclare la permission VIBRATE (aucune demande à l'utilisateur).
 */
export function haptic(ms = 12) {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  try {
    // Dans l'APK, le WebView n'implémente pas navigator.vibrate : on passe par le pont natif.
    const native = (window as { DisiNative?: { vibrate(ms: number): void } }).DisiNative;
    if (native) native.vibrate(ms);
    else navigator.vibrate?.(ms);
  } catch {
    /* non pris en charge */
  }
}
