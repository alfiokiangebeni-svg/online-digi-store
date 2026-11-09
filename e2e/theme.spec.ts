import { expect, test, toastZone } from "./fixtures";

const bodyBg = (page: import("@playwright/test").Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const LIGHT = "rgb(223, 226, 230)";
const DARK = "rgb(15, 20, 28)";
const AMETHYST = "rgb(18, 13, 31)";
const EMERALD = "rgb(8, 21, 15)";

test("Compte : « Nuit » choisi et gardé après rechargement", async ({ page }) => {
  await page.goto("/fr/compte");
  expect(await bodyBg(page)).toBe(LIGHT);
  const group = page.getByRole("radiogroup", { name: "Thème" });
  await expect(group.getByRole("radio", { name: "Automatique" })).toHaveAttribute("aria-checked", "true");
  await group.getByRole("radio", { name: "Nuit" }).click();
  await expect(toastZone(page)).toContainText("Thème appliqué : Nuit");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await bodyBg(page)).toBe(DARK);
  await page.goto("/fr");
  await page.reload();
  expect(await bodyBg(page)).toBe(DARK);
});

test("en-tête : le bouton de thème ouvre le sélecteur ; Améthyste puis Émeraude", async ({ page }) => {
  await page.goto("/fr/vendre");
  await page.getByRole("button", { name: "Changer de thème" }).click();
  const sheet = page.locator("dialog[open]");
  await sheet.getByRole("radio", { name: "Améthyste" }).click();
  expect(await bodyBg(page)).toBe(AMETHYST);
  await expect(sheet.getByRole("radio", { name: "Améthyste" })).toHaveAttribute("aria-checked", "true");
  await sheet.getByRole("radio", { name: "Émeraude" }).click();
  expect(await bodyBg(page)).toBe(EMERALD);
  await sheet.getByRole("button", { name: "Fermer" }).click();
  await page.goto("/fr/produit/maths-en-s-amusant");
  expect(await bodyBg(page)).toBe(EMERALD);
});

test.describe("téléphone en mode sombre", () => {
  test.use({ colorScheme: "dark" });

  test("« Automatique » suit le téléphone ; « Lumière » reste clair", async ({ page }) => {
    await page.goto("/fr/compte");
    expect(await bodyBg(page)).toBe(DARK);
    const group = page.getByRole("radiogroup", { name: "Thème" });
    await group.getByRole("radio", { name: "Lumière" }).click();
    expect(await bodyBg(page)).toBe(LIGHT);
    await group.getByRole("radio", { name: "Automatique" }).click();
    expect(await bodyBg(page)).toBe(DARK);
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
  });
});
