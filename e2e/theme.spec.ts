import { expect, test, toastZone } from "./fixtures";

const bodyBg = (page: import("@playwright/test").Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const LIGHT = "rgb(223, 226, 230)";
const DARK = "rgb(15, 20, 28)";

test("thème : clair par défaut, « Sombre » choisi dans Compte et gardé après rechargement", async ({
  page,
}) => {
  await page.goto("/fr/compte");
  expect(await bodyBg(page)).toBe(LIGHT);
  const group = page.getByRole("radiogroup", { name: "Thème" });
  await expect(group.getByRole("radio", { name: "Automatique" })).toHaveAttribute("aria-checked", "true");
  await group.getByRole("radio", { name: "Sombre" }).click();
  await expect(toastZone(page)).toContainText("Thème appliqué");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await bodyBg(page)).toBe(DARK);
  await page.goto("/fr");
  expect(await bodyBg(page)).toBe(DARK);
  await page.reload();
  expect(await bodyBg(page)).toBe(DARK);
});

test.describe("téléphone en mode sombre", () => {
  test.use({ colorScheme: "dark" });

  test("« Automatique » suit le téléphone ; « Clair » reste clair", async ({ page }) => {
    await page.goto("/fr/compte");
    expect(await bodyBg(page)).toBe(DARK);
    await page.getByRole("radiogroup", { name: "Thème" }).getByRole("radio", { name: "Clair" }).click();
    expect(await bodyBg(page)).toBe(LIGHT);
    await page.getByRole("radiogroup", { name: "Thème" }).getByRole("radio", { name: "Automatique" }).click();
    expect(await bodyBg(page)).toBe(DARK);
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
  });
});
