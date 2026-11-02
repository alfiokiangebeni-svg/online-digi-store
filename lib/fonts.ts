import localFont from "next/font/local";

/**
 * Police unique : Inter (maquette mobile), auto-hébergée, graisses 400 à 700 en un
 * seul fichier variable (scripts/build-fonts.py, voir app/fonts/README.md).
 */
export const inter = localFont({
  src: "../app/fonts/inter-var.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-inter",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const fontVariables = inter.variable;
