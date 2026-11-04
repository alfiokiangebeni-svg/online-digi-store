import localFont from "next/font/local";

/**
 * Charte « di.si store » : Plus Jakarta Sans (titres, prix, logo) et DM Sans (texte),
 * auto-hébergées, chacune en un seul fichier variable (scripts/build-fonts.py).
 */
export const display = localFont({
  src: "../app/fonts/jakarta-display.woff2",
  weight: "700 800",
  style: "normal",
  display: "swap",
  variable: "--font-jakarta",
  fallback: ["system-ui", "Roboto", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const body = localFont({
  src: "../app/fonts/dmsans-text.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-dmsans",
  fallback: ["system-ui", "Roboto", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const fontVariables = `${display.variable} ${body.variable}`;
