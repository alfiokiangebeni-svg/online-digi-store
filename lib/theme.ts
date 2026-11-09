/**
 * di.si store — miroir des tokens de app/theme.css pour le code et les tests
 * (contrastes, couleur de catégorie côté JavaScript). Doit rester identique au CSS :
 * tests/theme.test.ts échoue sinon.
 */
export const COLORS = {
  primary: "#b6f23a",
  primaryPressed: "#a2dc24",
  primaryText: "#365b00",
  background: "#dfe2e6",
  surface: "#f3f4f6",
  surfaceHigh: "#e6e8ec",
  border: "#959ca6",
  textPrimary: "#141821",
  textSecondary: "#4a515b",
  onPrimary: "#0e100f",
  onAccent: "#ffffff",
  night: "#1c2333",
  champagne: "#d9c28c",
  gold: "#7d5f1a",
  goldSoft: "#f0e5c8",
  terre: "#c8602f",
  terreSoft: "#f6dccd",
  terreDeep: "#8a3d17",
  terreStrong: "#8a3d17",
  urgent: "#e07a83",
  urgentSoft: "#f4d3d6",
  urgentText: "#9e2430",
  star: "#a8780f",
  success: "#24704f",
  successSoft: "#d2e9dc",
} as const;

/** Thème sombre « Nuit » : mêmes noms, valeurs du bloc `:root[data-theme="dark"]` de app/theme.css. */
export const COLORS_DARK: Record<keyof typeof COLORS, string> = {
  primary: "#b6f23a",
  primaryPressed: "#a2dc24",
  primaryText: "#b6f23a",
  background: "#0f141c",
  surface: "#172030",
  surfaceHigh: "#212b3b",
  border: "#465366",
  textPrimary: "#e9edf2",
  textSecondary: "#a3afbf",
  onPrimary: "#0e100f",
  onAccent: "#ffffff",
  night: "#24314a",
  champagne: "#d9c28c",
  gold: "#e3c47a",
  goldSoft: "#33290f",
  terre: "#e58a5c",
  terreSoft: "#3b2519",
  terreDeep: "#f4b893",
  terreStrong: "#8a3d17",
  urgent: "#e07a83",
  urgentSoft: "#3c1d22",
  urgentText: "#ff9ba3",
  star: "#f0be4f",
  success: "#5bd3a6",
  successSoft: "#133229",
};

export type ThemeChoice = "auto" | "light" | "dark";

/** Les 7 catégories (sans couleur propre : icônes en gris, palette minimale). */
export const CATEGORY_IDS = ["books", "apps", "realestate", "jobs", "music", "images", "tenders"] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

/** Classe CSS d'une catégorie (repère neutre, conservé pour les styles par catégorie). */
export const categoryClass = (id: CategoryId) => `cat-${id}`;
