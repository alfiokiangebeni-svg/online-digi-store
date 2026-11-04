import { expect, test, toastZone } from "./fixtures";

test.describe("Vendre / Publier", () => {
  test("formulaire : champs obligatoires, brouillon, aperçu, publication", async ({ page }) => {
    await page.goto("/fr/vendre");
    await page.getByRole("button", { name: /^Offres d'emploi/ }).click();
    await expect(page.getByRole("heading", { name: "2. Décris ton annonce" })).toBeVisible();

    await page.getByRole("button", { name: "Aperçu avant publication" }).click();
    await expect(toastZone(page)).toContainText("Corrige les champs en rouge");
    await expect(page.getByText("Indique un titre (5 caractères minimum).")).toBeVisible();

    await page.getByLabel("Titre").fill("Chauffeur livreur moto");
    await page
      .getByLabel("Description")
      .fill("Livraisons dans Kinshasa, permis A obligatoire, moto fournie.");
    await page.getByRole("group", { name: "Contrat" }).getByRole("button", { name: "CDD" }).click();
    await page.getByLabel("Salaire mensuel (USD)").fill("350");
    await page.getByRole("button", { name: "Enregistrer le brouillon" }).click();
    await expect(toastZone(page)).toContainText("Brouillon enregistré");

    // Le brouillon est repris en revenant sur la catégorie.
    await page.reload();
    await expect(page.getByText(/Brouillon repris/)).toBeVisible();
    await expect(page.getByLabel("Titre")).toHaveValue("Chauffeur livreur moto");

    await page.getByLabel("Numéro de contact").fill("0821234567");
    await page.getByRole("button", { name: "Aperçu avant publication" }).click();
    await expect(page.getByRole("heading", { name: "Aperçu de ton annonce" })).toBeVisible();
    await expect(page.getByText("350 $")).toBeVisible();
    await page.getByRole("button", { name: "Publier l'annonce" }).click();
    await expect(page.getByText("Publié", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Voir mes annonces" }).click();
    await expect(page.getByRole("radio", { name: "Mes annonces (1)" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(page.getByText("Chauffeur livreur moto")).toBeVisible();
    await expect(page.getByText("En vérification")).toBeVisible();
    await expect(page.getByText("Candidatures")).toBeVisible();
  });

  test("mes annonces : booster (Mobile Money), supprimer puis annuler", async ({ page }) => {
    await page.addInitScript(() => {
      if (sessionStorage.getItem("seeded")) return;
      localStorage.setItem(
        "ds-my-listings",
        JSON.stringify([
          {
            id: "l-1",
            category: "books",
            values: { title: "Mon roman", price: "4" },
            at: Date.now() - 600_000,
          },
        ]),
      );
      sessionStorage.setItem("seeded", "1");
    });
    await page.goto("/fr/vendre?onglet=mine");
    await expect(page.getByText("En ligne")).toBeVisible();
    await page.getByRole("button", { name: "Booster mon annonce" }).click();
    await page.locator("dialog[open]").getByLabel("Numéro Mobile Money").fill("0821234567");
    await page
      .locator("dialog[open]")
      .getByRole("button", { name: /^Payer/ })
      .click();
    await expect(page.getByText("Annonce boostée")).toBeVisible({ timeout: 10_000 });
    await page.locator("dialog[open]").getByRole("button", { name: "Fermer" }).click();
    await expect(page.getByText("Boostée 7 jours")).toBeVisible();

    await page.getByRole("button", { name: "Supprimer" }).click();
    await expect(page.getByText("Tu n'as encore rien publié.")).toBeVisible();
    await toastZone(page).getByRole("button", { name: "Annuler" }).click();
    await expect(page.getByText("Mon roman")).toBeVisible();
  });

  test("messages reçus : répondre", async ({ page }) => {
    await page.goto("/fr/vendre?onglet=inbox");
    await expect(page.getByText("Joël M.").filter({ visible: true })).toBeVisible();
    await page.getByRole("button", { name: "Répondre" }).first().click();
    const sheet = page.locator("dialog[open]");
    await sheet.getByRole("button", { name: "Envoyer" }).click();
    await expect(sheet.getByText("Écris ta réponse.")).toBeVisible();
    await sheet.getByLabel("Ta réponse").fill("Oui, passez à 10 h.");
    await sheet.getByRole("button", { name: "Envoyer" }).click();
    await expect(toastZone(page)).toContainText("Réponse envoyée");
    await expect(page.getByText("Oui, passez à 10 h.")).toBeVisible();
  });

  test("« Publier un appel d'offres » ouvre directement le bon formulaire", async ({ page }) => {
    await page.goto("/fr/vendre?categorie=tenders");
    await expect(page.getByRole("heading", { name: "2. Décris ton annonce" })).toBeVisible();
    await expect(page.getByLabel("Documents requis (un par ligne)")).toBeVisible();
  });
});
