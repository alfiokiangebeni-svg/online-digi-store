/**
 * di.si store — miroir des tokens de app/theme.css pour le code et les tests
 * (contrastes, couleur de catégorie côté JavaScript). Doit rester identique au CSS :
 * tests/theme.test.ts échoue sinon.
 */
export const COLORS = {
  primary: "#b6f23a",
  primaryPressed: "#a2dc24",
  primaryText: "#365b00",
  background: "#dcdfdb",
  surface: "#eef0ec",
  surfaceHigh: "#e1e4df",
  border: "#c5cac4",
  textPrimary: "#141816",
  textSecondary: "#4c544f",
  onPrimary: "#0e100f",
  onAccent: "#ffffff",
  urgent: "#e07a83",
  urgentSoft: "#f4d3d6",
  urgentText: "#9e2430",
  star: "#a8780f",
  success: "#24704f",
  successSoft: "#d2e9dc",
} as const;

/** Les 7 catégories (sans couleur propre : icônes en gris, palette minimale). */
export const CATEGORY_IDS = ["books", "apps", "realestate", "jobs", "music", "images", "tenders"] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

/** Classe CSS d'une catégorie (repère neutre, conservé pour les styles par catégorie). */
export const categoryClass = (id: CategoryId) => `cat-${id}`;
