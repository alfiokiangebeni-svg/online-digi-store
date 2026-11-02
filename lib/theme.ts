/**
 * di.si store — miroir des tokens de app/theme.css pour le code et les tests
 * (contrastes, couleur de catégorie côté JavaScript). Doit rester identique au CSS :
 * tests/theme.test.ts échoue sinon.
 */
export const COLORS = {
  primary: "#b6f23a",
  primaryPressed: "#9bd61f",
  background: "#1c1f1e",
  surface: "#262a28",
  surfaceHigh: "#323735",
  border: "#3e4441",
  textPrimary: "#f2f5f3",
  textSecondary: "#a3aca7",
  onPrimary: "#0e100f",
  urgent: "#ff4d5e",
  urgentText: "#ff5e6d",
  star: "#ffc53d",
  success: "#2ed3a0",
} as const;

/** Les 7 catégories (sans couleur propre : icônes en gris, palette minimale). */
export const CATEGORY_IDS = ["books", "apps", "realestate", "jobs", "music", "images", "tenders"] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

/** Classe CSS d'une catégorie (repère neutre, conservé pour les styles par catégorie). */
export const categoryClass = (id: CategoryId) => `cat-${id}`;
