import { test as base, expect, type Page } from "@playwright/test";

/** Chaque test échoue si une erreur JavaScript survient sur la page. */
export const test = base.extend<{ page: Page }>({
  page: async ({ page }, provide) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await provide(page);
    expect(errors, "aucune erreur JavaScript").toEqual([]);
  },
});
export { expect };

/** Prépare l'état du téléphone (panier, bibliothèque…) avant le premier chargement. */
export async function seed(page: Page, values: Record<string, unknown>) {
  await page.addInitScript((v) => {
    if (sessionStorage.getItem("e2e-seeded")) return;
    for (const [k, val] of Object.entries(v)) localStorage.setItem(k, JSON.stringify(val));
    sessionStorage.setItem("e2e-seeded", "1");
  }, values);
}

/** Message de retour d'action (zone aria-live en bas d'écran). */
export const toastZone = (page: Page) => page.locator("div[role=status][aria-live=polite].fixed");
