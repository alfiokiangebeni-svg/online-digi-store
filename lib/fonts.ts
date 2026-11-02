import localFont from "next/font/local";

/**
 * Trois familles maximum (docs/DESIGN.md), auto-hébergées.
 * Fichiers figés et réduits au latin par scripts/build-fonts.py (voir app/fonts/README.md).
 */
export const display = localFont({
  src: "../app/fonts/bricolage-grotesque-700.woff2",
  weight: "700",
  style: "normal",
  // « optional » : pas de second rendu du titre (élément LCP) quand la police arrive tard
  // en 3G. Elle est mise en cache (service worker) et s'affiche dès la visite suivante.
  display: "optional",
  variable: "--font-bricolage",
  fallback: ["Arial Narrow", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const body = localFont({
  src: [
    { path: "../app/fonts/work-sans-400.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/work-sans-500.woff2", weight: "500", style: "normal" },
  ],
  display: "swap",
  variable: "--font-work",
  fallback: ["system-ui", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
  // Non préchargée : la bande passante va d'abord à la police du titre (LCP).
  // Le CSS est intégré au HTML, la police est donc découverte immédiatement.
  preload: false,
});

export const mono = localFont({
  src: [
    { path: "../app/fonts/space-mono-400.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/space-mono-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-space-mono",
  fallback: ["ui-monospace", "Courier New", "monospace"],
  adjustFontFallback: false,
  // Les prix ne sont jamais l'élément LCP : pas de préchargement.
  preload: false,
});

export const fontVariables = `${display.variable} ${body.variable} ${mono.variable}`;
