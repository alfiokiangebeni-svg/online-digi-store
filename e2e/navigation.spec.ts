import { expect, test } from "./fixtures";

test.describe("Barre du bas", () => {
  test("les 5 onglets mènent au bon écran et s'allument", async ({ page }) => {
    await page.goto("/fr");
    const nav = page.getByRole("navigation", { name: "Navigation principale" });
    await expect(nav.getByRole("link")).toHaveText(["Accueil", "Catégories", "Vendre", "Panier", "Compte"]);
    for (const [label, url, heading] of [
      ["Catégories", /\/fr\/categories$/, "Catégories"],
      ["Vendre", /\/fr\/vendre$/, "Vendre ou publier"],
      ["Compte", /\/fr\/compte$/, "Compte invité"],
      ["Accueil", /\/fr$/, null],
    ] as const) {
      await nav.getByRole("link", { name: label }).click();
      await expect(page).toHaveURL(url);
      await expect(nav.getByRole("link", { name: label })).toHaveAttribute("aria-current", "page");
      if (heading) await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    }
    await nav.getByRole("link", { name: "Panier" }).click();
    await expect(page).toHaveURL(/\/fr\/panier$/);
  });
});

test.describe("En-tête", () => {
  test("recherche permanente depuis n'importe quel onglet", async ({ page }) => {
    await page.goto("/fr/categories");
    const box = page.getByRole("searchbox", { name: "Rechercher dans le catalogue" });
    await box.fill("rumba");
    await box.press("Enter");
    await expect(page).toHaveURL(/\/fr\/explorer\?q=rumba/);
    await expect(page.getByRole("link", { name: /Rumba douce/ })).toBeVisible();
  });

  test("notifications : la cloche ouvre la liste, un lien y mène", async ({ page }) => {
    await page.goto("/fr/vendre");
    await page.getByRole("button", { name: "Notifications" }).click();
    const sheet = page.locator("dialog[open]");
    await expect(sheet.getByRole("heading", { name: "Notifications" })).toBeVisible();
    await expect(sheet.getByText("Démo")).toBeVisible();
    await sheet.getByRole("link", { name: /Nouveau en Musique/ }).click();
    await expect(page).toHaveURL(/\/fr\/produit\/rumba-douce$/);
  });
});

test.describe("Accueil et catégories", () => {
  test("bandeau à la une et grille des 7 catégories", async ({ page }) => {
    await page.goto("/fr");
    const grid = page.getByRole("navigation", { name: "Catégories" });
    await expect(grid.getByRole("link")).toHaveCount(8);
    await grid.getByRole("link", { name: "Musique" }).click();
    await expect(page).toHaveURL(/\/fr\/categories\/musique$/);
    await expect(page.getByText("3 contenus").filter({ visible: true })).toBeVisible();

    await page.goto("/fr");
    await page.getByRole("link", { name: /Vendeurs.*Commencer/ }).click();
    await expect(page).toHaveURL(/\/fr\/vendre$/);
  });

  test("page catégorie : filtres par type, Retour vers Catégories", async ({ page }) => {
    await page.goto("/fr/categories");
    await page.getByRole("link", { name: /^Livres/ }).click();
    await expect(page).toHaveURL(/\/fr\/categories\/livres$/);
    await expect(page.getByText("3 contenus").filter({ visible: true })).toBeVisible();
    await page
      .getByRole("group", { name: "Type de contenu" })
      .getByRole("button", { name: "Formation" })
      .click();
    await expect(page.getByText("1 contenus").filter({ visible: true })).toBeVisible();
    await page.getByRole("link", { name: "Retour" }).click();
    await expect(page).toHaveURL(/\/fr\/categories(\?.*)?$/);
  });

  test("les 7 catégories affichent leur nombre de contenus ou d'annonces", async ({ page }) => {
    await page.goto("/fr/categories");
    await expect(page.getByRole("link", { name: /^Immobilier 5 contenus/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Appels d'offres 3 contenus/ })).toBeVisible();
  });

  test("catégorie inconnue : page 404 de la boutique", async ({ page }) => {
    await page.goto("/fr/categories/voitures");
    await expect(page.getByRole("heading", { name: "Page introuvable" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Catégories" }).first()).toBeVisible();
  });
});

test.describe("Vendre et compte", () => {
  test("chaque catégorie ouvre WhatsApp avec le message prêt", async ({ page }) => {
    await page.goto("/fr/vendre");
    const tile = page.getByRole("link", { name: "Offres d'emploi" });
    const href = (await tile.getAttribute("href")) ?? "";
    expect(href).toContain("https://wa.me/243824176729?text=");
    expect(decodeURIComponent(href)).toContain("je veux publier sur di.si store : Offres d'emploi");
  });

  test("Compte → Mes achats, Retour vers Compte", async ({ page }) => {
    await page.goto("/fr/compte");
    await page.getByRole("link", { name: /Mes achats/ }).click();
    await expect(page).toHaveURL(/\/fr\/bibliotheque$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mes achats");
    await page.getByRole("link", { name: "Retour" }).click();
    await expect(page).toHaveURL(/\/fr\/compte$/);
  });

  test("Devenir vendeur mène à l'onglet Vendre", async ({ page }) => {
    await page.goto("/fr/compte");
    await page.getByRole("link", { name: "Devenir vendeur" }).click();
    await expect(page).toHaveURL(/\/fr\/vendre$/);
  });
});
