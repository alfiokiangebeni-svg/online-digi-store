import { expect, seed, test, toastZone } from "./fixtures";

const PAY_WAIT = 5_500; // l'adaptateur de démonstration répond en ≈ 4,2 s

test.describe("Recherche et filtres", () => {
  test("recherche depuis l'accueil (faute tolérée)", async ({ page }) => {
    await page.goto("/fr");
    await page.getByRole("searchbox").first().fill("kinshassa");
    await page.getByRole("searchbox").first().press("Enter");
    await expect(page).toHaveURL(/explorer.*q=kinshassa/);
    await expect(page.getByText(/^\d+ contenus$/)).toHaveText(/[1-9]/);
    await expect(page.getByRole("link", { name: /Kinshasa, mode d'emploi/ }).first()).toBeVisible();
  });

  test("filtres type, prix, tri et « Effacer les filtres »", async ({ page }) => {
    await page.goto("/fr/explorer?type=music");
    await expect(page.getByText("3 contenus")).toBeVisible();
    await page.getByRole("radio", { name: "Gratuits" }).click();
    await expect(page.getByText("1 contenus")).toBeVisible();
    await page.getByRole("button", { name: /^Tri/ }).click();
    await expect(page.getByRole("button", { name: /Prix croissant/ })).toBeVisible();
    await page.goto("/fr/explorer?q=zzzzzz");
    await page.getByRole("button", { name: "Effacer les filtres" }).click();
    await expect(page.getByText(/^1[0-9] contenus$/)).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("« Retour » revient à l'écran précédent", async ({ page }) => {
    await page.goto("/fr/explorer?type=music");
    await page.locator("main a[href*='/produit/']").first().click();
    await expect(page).toHaveURL(/produit/);
    await page.getByRole("link", { name: "Retour" }).click();
    await expect(page).toHaveURL(/explorer\?type=music/);
  });

  test("« Retour » sur une fiche ouverte directement va à l'accueil", async ({ page }) => {
    await page.goto("/fr/produit/rumba-douce");
    await page.getByRole("link", { name: "Retour" }).click();
    await expect(page).toHaveURL(/\/fr\/?$/);
  });

  test("page 404 de la boutique, dans la langue, avec sorties", async ({ page }) => {
    for (const [url, title] of [
      ["/fr/inconnu", "Page introuvable"],
      ["/ln/inconnu", "Lokasa ezwami te"],
      ["/de", "Page introuvable"],
    ]) {
      await page.goto(url);
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
    }
    await page.goto("/fr/inconnu");
    await page.getByRole("link", { name: "Retour à l'accueil" }).click();
    await expect(page).toHaveURL(/\/fr\/?$/);
  });
});

test.describe("Achat", () => {
  test("ajout rapide : ajoute, confirme, puis « Voir » ouvre le panier", async ({ page }) => {
    await page.goto("/fr");
    const add = page.getByRole("button", { name: "Ajouter « Maths en s'amusant » au panier" }).first();
    await add.click();
    await expect(toastZone(page)).toContainText("Ajouté au panier");
    await page
      .getByRole("button", { name: /Ajouté au panier — Voir le panier/ })
      .first()
      .click();
    await expect(page).toHaveURL(/panier/);
    await expect(page.getByRole("link", { name: "Maths en s'amusant" })).toBeVisible();
  });

  test("fiche : « Ajouter au panier » puis « Acheter maintenant »", async ({ page }) => {
    await page.goto("/fr/produit/vendre-sur-whatsapp");
    await page.getByRole("button", { name: "Ajouter au panier" }).click();
    await expect(toastZone(page)).toContainText("Ajouté au panier");
    await expect(page.getByRole("link", { name: "Dans le panier" })).toBeVisible();
    await page.goto("/fr/produit/kinshasa-mode-emploi");
    await page.getByRole("button", { name: "Acheter maintenant" }).click();
    await expect(page).toHaveURL(/panier/);
    await expect(page.getByRole("button", { name: /^Retirer / })).toHaveCount(2);
  });

  test("panier : « Retirer » puis « Annuler »", async ({ page }) => {
    await seed(page, { "ds-cart": [{ slug: "rumba-douce" }] });
    await page.goto("/fr/panier");
    await page.getByRole("button", { name: "Retirer Rumba douce" }).click();
    await expect(page.getByText("Ton panier est vide.")).toBeVisible();
    await toastZone(page).getByRole("button", { name: "Annuler" }).click();
    await expect(page.getByRole("link", { name: "Rumba douce" })).toBeVisible();
  });

  test("coupon récupéré sur l'accueil, appliqué tout seul au panier", async ({ page }) => {
    await page.goto("/fr");
    await page.getByRole("button", { name: "Récupérer" }).first().click();
    await expect(toastZone(page)).toContainText("KIN2026");
    await seed(page, { "ds-cart": [{ slug: "kinshasa-mode-emploi" }] });
    await page.evaluate(() =>
      localStorage.setItem("ds-cart", JSON.stringify([{ slug: "kinshasa-mode-emploi" }])),
    );
    await page.goto("/fr/panier");
    await expect(page.getByText("Code KIN2026 appliqué.")).toBeVisible();
  });

  test("carte bancaire : « Bientôt disponible », Mobile Money reste choisi", async ({ page }) => {
    await seed(page, { "ds-cart": [{ slug: "rumba-douce" }] });
    await page.goto("/fr/panier");
    // élément marqué indisponible (aria-disabled) : le toucher affiche l'explication
    await page.getByRole("radio", { name: /Carte bancaire/ }).click({ force: true });
    await expect(toastZone(page)).toContainText("bientôt disponible");
    await expect(page.getByRole("radio", { name: /Mobile Money/ })).toHaveAttribute("aria-checked", "true");
  });

  test("paiement : échecs « PIN refusé » et « solde insuffisant », puis succès « Livré »", async ({
    page,
  }) => {
    await seed(page, { "ds-cart": [{ slug: "rumba-douce" }] });
    await page.goto("/fr/panier");
    const pay = page.getByRole("button", { name: /^Payer/ });
    const dialogStatus = page.locator("dialog[open] [role=status]");
    await page.fill("#pay-phone", "0824176721");
    await pay.click();
    await expect(dialogStatus).toContainText("Code incorrect", { timeout: PAY_WAIT * 2 });
    await page.getByRole("button", { name: "Réessayer" }).click();
    await expect(dialogStatus).toContainText("Code incorrect", { timeout: PAY_WAIT * 2 });
    await page.getByRole("button", { name: "Annuler" }).click();
    await page.fill("#pay-phone", "0824176722");
    await pay.click();
    await expect(dialogStatus).toContainText("Solde insuffisant", { timeout: PAY_WAIT * 2 });
    await page.getByRole("button", { name: "Annuler" }).click();
    await page.fill("#pay-phone", "0824176729");
    await pay.click();
    await expect(dialogStatus).toContainText("Paiement reçu", { timeout: PAY_WAIT * 2 });
    await page.getByRole("link", { name: "Ouvrir ma bibliothèque" }).click();
    await expect(page).toHaveURL(/bibliotheque/);
    await expect(page.getByText(/Paiement confirmé/)).toBeVisible();
  });

  test("paiement : numéro incomplet → message d'erreur clair", async ({ page }) => {
    await seed(page, { "ds-cart": [{ slug: "rumba-douce" }] });
    await page.goto("/fr/panier");
    await page.fill("#pay-phone", "0824");
    await page.getByRole("button", { name: /^Payer/ }).click();
    await expect(page.getByText("Numéro incomplet ou opérateur inconnu.")).toBeVisible();
  });
});

test.describe("Fiche produit", () => {
  test("favoris : ajout confirmé et visible dans Compte", async ({ page }) => {
    await page.goto("/fr/produit/le-fleuve-et-nous");
    await page.getByRole("button", { name: "Ajouter aux favoris" }).click();
    await expect(toastZone(page)).toContainText("Ajouté à tes favoris");
    await page.goto("/fr/compte");
    await expect(page.getByRole("link", { name: /Le fleuve et nous/ })).toBeVisible();
  });

  test("partager : WhatsApp, Facebook et copier le lien", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/fr/produit/rumba-douce");
    await page.getByRole("button", { name: "Partager" }).click();
    const sheet = page.locator("dialog[open]");
    await expect(sheet.getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
      "href",
      /^https:\/\/wa\.me\/\?text=.*Rumba/,
    );
    await expect(sheet.getByRole("link", { name: "Facebook" })).toHaveAttribute(
      "href",
      /facebook\.com\/sharer/,
    );
    await sheet.getByRole("button", { name: "Copier le lien" }).click();
    await expect(toastZone(page)).toContainText("Lien copié");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("/fr/produit/rumba-douce");
  });

  test("offrir à un numéro : cadeau ajouté au panier", async ({ page }) => {
    await page.goto("/fr/produit/maths-en-s-amusant");
    await page.getByRole("button", { name: "Offrir" }).click();
    await page.fill("#gift-maths-en-s-amusant", "0991234567");
    await page.getByRole("button", { name: "Ajouter le cadeau au panier" }).click();
    await expect(toastZone(page)).toContainText("Cadeau ajouté");
    await page.goto("/fr/panier");
    await expect(page.getByText("Offert à 099 123 4567")).toBeVisible();
  });

  test("aperçus : ouvrir en grand, suivant, fermer", async ({ page }) => {
    await page.goto("/fr/produit/kinshasa-mode-emploi");
    await page.getByRole("button", { name: "Agrandir l'aperçu 1" }).click();
    const dialog = page.locator("dialog[open]");
    await expect(dialog).toContainText("Aperçu 1 sur 3");
    await page.getByRole("button", { name: "Aperçu suivant" }).click();
    await expect(dialog).toContainText("Aperçu 2 sur 3");
    await dialog.getByRole("button", { name: "Fermer" }).click();
    await expect(page.locator("dialog[open]")).toHaveCount(0);
  });

  test("choix de version : la taille change", async ({ page }) => {
    await page.goto("/fr/produit/maths-en-s-amusant");
    await page.getByRole("button", { name: "Windows" }).click();
    await expect(page.locator("fieldset").filter({ visible: true })).toContainText("120 Mo");
  });
});

test.describe("Bibliothèque et lecteur", () => {
  test("télécharger puis « Ouvrir » mène au lecteur", async ({ page }) => {
    await seed(page, { "ds-library": [{ slug: "rumba-douce", at: Date.now(), paidUsdCents: 99 }] });
    await page.goto("/fr/bibliotheque");
    await page.getByRole("button", { name: "Télécharger — Rumba douce" }).click();
    await expect(toastZone(page)).toContainText("Téléchargé", { timeout: 6_000 });
    await page.getByRole("link", { name: "Ouvrir — Rumba douce" }).click();
    await expect(page).toHaveURL(/lecteur\/?\?id=rumba-douce/);
    await page.getByRole("button", { name: /Écouter un extrait de Rumba douce/ }).click();
    await expect(page.getByRole("button", { name: "Mettre en pause l'extrait" })).toBeVisible();
  });

  test("lecteur de livre : pages et reprise de lecture", async ({ page }) => {
    await seed(page, {
      "ds-library": [{ slug: "le-fleuve-et-nous", at: Date.now(), paidUsdCents: 899, downloaded: true }],
    });
    await page.goto("/fr/lecteur?id=le-fleuve-et-nous");
    await expect(page.getByText("Page 1 sur 7")).toBeVisible();
    await page.getByRole("button", { name: "Page suivante" }).click();
    await page.getByRole("button", { name: "Page suivante" }).click();
    await expect(page.getByText("Page 3 sur 7")).toBeVisible();
    await page.reload();
    await expect(page.getByText("Page 3 sur 7")).toBeVisible();
    await expect(page.getByText("Ta page est mémorisée")).toBeVisible();
  });
});

test.describe("Compte et réglages", () => {
  test("contrôle parental : Explorer filtré et code demandé avant paiement", async ({ page }) => {
    await page.goto("/fr/compte");
    await page.getByRole("switch", { name: "Contrôle parental" }).click();
    await page.getByRole("button", { name: "3 ans" }).click();
    await page.fill("#pin", "1234");
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await expect(toastZone(page)).toContainText("Code parental enregistré");
    await page.goto("/fr/explorer");
    await expect(page.getByText(/Contrôle parental actif/)).toBeVisible();
    await page.evaluate(() => localStorage.setItem("ds-cart", JSON.stringify([{ slug: "rumba-douce" }])));
    await page.goto("/fr/panier");
    await page.fill("#pay-phone", "0824176729");
    await page.getByRole("button", { name: /^Payer/ }).click();
    await page.fill("#parental-pin", "0000");
    await page.getByRole("button", { name: "Valider" }).click();
    await expect(page.getByText("Code incorrect.")).toBeVisible();
    await page.fill("#parental-pin", "1234");
    await page.getByRole("button", { name: "Valider" }).click();
    await expect(page.locator("dialog[open] [role=status]")).toContainText("Paiement reçu", {
      timeout: 12_000,
    });
  });

  test("devise CDF / USD gardée après rechargement", async ({ page }) => {
    await page.goto("/fr");
    await page.getByRole("radio", { name: "FC" }).click();
    await page.reload();
    await expect(page.locator(".cur-cdf .price-tag").first()).toBeVisible();
  });

  test("données légères : activées et gardées", async ({ page }) => {
    await page.goto("/fr/compte");
    await page.getByRole("switch", { name: "Données légères" }).click();
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.hasAttribute("data-lite"))).toBe(true);
  });

  test("changer de langue", async ({ page }) => {
    await page.goto("/fr/compte");
    await page.getByRole("link", { name: "Lingála" }).first().click();
    await expect(page).toHaveURL(/\/ln\//);
    await expect(page.locator("html")).toHaveAttribute("lang", "ln");
  });
});

test.describe("Hors connexion", () => {
  test("bandeau explicite et « Réessayer »", async ({ page, context }) => {
    await page.goto("/fr");
    await context.setOffline(true);
    const banner = page.getByRole("alert").filter({ hasText: "Hors connexion" });
    await expect(banner).toBeVisible();
    await expect(banner.getByRole("button", { name: "Réessayer" })).toBeVisible();
    await context.setOffline(false);
    await expect(banner).toHaveCount(0);
  });
});
