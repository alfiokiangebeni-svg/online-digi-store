import { expect, test } from "./fixtures";

/** Chaque langue s'affiche sans erreur (dont les erreurs d'hydratation, ex. format des nombres). */
const PAGES = [
  "",
  "explorer",
  "categories/livres",
  "categories/immobilier",
  "produit/rumba-douce",
  "panier",
  "compte",
  "vendre",
];

for (const locale of ["ln", "en"]) {
  test(`pages en ${locale} sans erreur`, async ({ page }) => {
    for (const path of PAGES) {
      await page.goto(`/${locale}/${path}`);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
    }
  });
}

test("lingala : les prix s'écrivent comme en français", async ({ page }) => {
  await page.goto("/ln/produit/kinshasa-mode-emploi");
  await expect(page.locator("main").getByText("4,99 $").first()).toBeVisible();
});
