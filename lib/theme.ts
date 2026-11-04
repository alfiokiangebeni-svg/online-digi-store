/**
 * di.si store — miroir des tokens de app/theme.css pour le code et les tests
 * (contrastes, couleur de catégorie côté JavaScript). Doit rester identique au CSS :
 * tests/theme.test.ts échoue sinon.
 */
export const COLORS = {
  primary: "#b6f23a",
  primaryPressed: "#a2dc24",
  primaryText: "#3a6200",
  background: "#f3f4f2",
  surface: "#ffffff",
  surfaceHigh: "#eaece9",
  border: "#d8dcd7",
  textPrimary: "#141816",
  textSecondary: "#555d58",
  onPrimary: "#0e100f",
  onAccent: "#ffffff",
  urgent: "#d42b3a",
  urgentText: "#c41f2e",
  star: "#b07a00",
  success: "#0a7655",
} as const;

/** Les 7 catégories (sans couleur propre : icônes en gris, palette minimale). */
export const CATEGORY_IDS = ["books", "apps", "realestate", "jobs", "music", "images", "tenders"] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

/** Classe CSS d'une catégorie (repère neutre, conservé pour les styles par catégorie). */
export const categoryClass = (id: CategoryId) => `cat-${id}`;
