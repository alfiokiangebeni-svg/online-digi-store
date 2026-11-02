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
  promo: "#ff7a1a",
  urgent: "#ff4d5e",
  urgentText: "#ff5e6d",
  trust: "#3ba9ff",
  premium: "#ffc53d",
  success: "#2ed3a0",
} as const;

/** Les 7 catégories de la plateforme et leur couleur de repère. */
export const CATEGORY_COLORS = {
  books: "#ffb547",
  apps: "#3ba9ff",
  realestate: "#2ed3a0",
  jobs: "#8f9bff",
  music: "#ff5fa2",
  images: "#ff8a5b",
  tenders: "#ffc53d",
} as const;

export type CategoryId = keyof typeof CATEGORY_COLORS;
export const CATEGORY_IDS = Object.keys(CATEGORY_COLORS) as CategoryId[];

/** Classe CSS qui pose la couleur de repère (--cat) sur un élément. */
export const categoryClass = (id: CategoryId) => `cat-${id}`;
