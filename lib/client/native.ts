"use client";

/**
 * Pont avec l'application Android (MainActivity → `window.DisiNative`).
 * Dans un navigateur, ces fonctions retombent sur les API web quand elles existent.
 */
interface DisiNative {
  voice(lang: string): void;
  scan(): void;
  vibrate(ms: number): void;
}

type Callback = (text: string) => void;
type ErrorCallback = (kind: "voice" | "scan", reason: string) => void;

declare global {
  interface Window {
    DisiNative?: DisiNative;
    __disiVoice?: Callback;
    __disiScan?: Callback;
    __disiNativeError?: ErrorCallback;
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
}

export const nativeBridge = () => (typeof window === "undefined" ? undefined : window.DisiNative);

export function canVoice(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.DisiNative || window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function canScan(): boolean {
  return typeof window !== "undefined" && Boolean(window.DisiNative);
}

/** Recherche vocale : texte reconnu, ou erreur (« no-speech », « cancelled »…). */
export function startVoice(lang: string, onText: Callback, onError: (reason: string) => void) {
  window.__disiVoice = onText;
  window.__disiNativeError = (kind, reason) => kind === "voice" && onError(reason);
  const native = nativeBridge();
  if (native) return native.voice(lang);
  const Rec = window.SpeechRecognition ?? window.webkitSpeechRecognition;
  if (!Rec) return onError("unsupported");
  const rec = new Rec();
  rec.lang = lang;
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  let done = false;
  rec.onresult = (e) => {
    done = true;
    onText(e.results[0][0].transcript);
  };
  rec.onerror = (e) => {
    done = true;
    onError(e.error);
  };
  rec.onend = () => {
    if (!done) onError("no-speech");
  };
  rec.start();
}

/** Scan d'un QR code ou code-barres (lecteur de codes Google, dans l'application). */
export function startScan(onText: Callback, onError: (reason: string) => void) {
  window.__disiScan = onText;
  window.__disiNativeError = (kind, reason) => kind === "scan" && onError(reason);
  const native = nativeBridge();
  if (!native) return onError("unsupported");
  native.scan();
}
