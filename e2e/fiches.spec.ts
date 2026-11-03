import { expect, seed, test, toastZone } from "./fixtures";

const sheet = (page: import("@playwright/test").Page) => page.locator("dialog[open]");

test.describe("Livres", () => {
  test("lire un extrait gratuit, puis « Acheter pour lire la suite »", async ({ page }) => {
    await page.goto("/fr/produit/kinshasa-mode-emploi");
    await page.getByRole("link", { name: "Lire un extrait" }).click();
    await expect(page.getByText("Extrait gratuit").filter({ visible: true })).toBeVisible();
    await page.getByRole("button", { name: "Page suivante" }).click();
    await expect(page.getByText("Page 2 sur 2")).toBeVisible();
    await page.getByRole("link", { name: "Acheter pour lire la suite" }).click();
    await expect(page).toHaveURL(/\/fr\/produit\/kinshasa-mode-emploi$/);
  });

  test("le format choisi part avec la ligne du panier", async ({ page }) => {
    await page.goto("/fr/produit/kinshasa-mode-emploi");
    await page.getByRole("group", { name: "Format" }).getByRole("button", { name: "Livre audio" }).click();
    await expect(page.getByText("Format : Livre audio")).toBeVisible();
    await page.getByRole("button", { name: "Ajouter au panier" }).click();
    await page.goto("/fr/panier");
    await expect(page.getByText("Format : Livre audio")).toBeVisible();
  });
});

test.describe("Applications", () => {
  test("voir les captures, compatibilité, notes de mise à jour", async ({ page }) => {
    await page.goto("/fr/produit/maths-en-s-amusant");
    await page.getByRole("button", { name: "Voir les captures" }).click();
    await expect(sheet(page).getByText("Aperçu 1 sur 3")).toBeVisible();
    await sheet(page).getByRole("button", { name: "Fermer" }).click();
    await expect(page.getByText("Android 7.0 ou plus récent")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Nouveautés de la version 2.3.1" })).toBeVisible();
  });

  test("contrôle parental : avertissement sur la fiche", async ({ page }) => {
    await seed(page, { "ds-parental": { enabled: true, maxAge: 3, pin: "1234" } });
    await page.goto("/fr/produit/course-des-petites-voitures");
    await expect(page.getByRole("status").filter({ hasText: "Contrôle parental actif" })).toBeVisible();
  });
});

test.describe("Musique", () => {
  test("écouter un titre : mini-lecteur persistant d'un écran à l'autre", async ({ page }) => {
    await page.goto("/fr/produit/comptines-du-matin");
    await page.getByRole("button", { name: /Écouter.*Mama ya ngai/ }).click();
    const player = page.getByRole("region", { name: "En écoute" });
    await expect(player).toContainText("Mama ya ngai");
    await page.getByRole("link", { name: "Retour" }).click();
    await expect(player).toContainText("Mama ya ngai");
    await player.getByRole("button", { name: "Arrêter l'écoute" }).click();
    await expect(player).toBeHidden();
  });

  test("acheter un titre seul, l'album, et ajouter à ma playlist", async ({ page }) => {
    await page.goto("/fr/produit/comptines-du-matin");
    await page.getByRole("button", { name: "Acheter le titre — Tolamuka" }).click();
    await expect(toastZone(page)).toContainText("Titre ajouté au panier");
    await page.getByRole("button", { name: "Ajouter à ma playlist — Tolamuka" }).click();
    await expect(toastZone(page)).toContainText("Ajouté à ta playlist");
    await expect(page.getByRole("button", { name: "Acheter l'album" })).toBeVisible();
    await page.goto("/fr/panier");
    await expect(page.getByText("Titre : Tolamuka")).toBeVisible();
    await expect(page.locator("main")).toContainText("0,49 $");
    await page.goto("/fr/compte");
    await expect(
      page.getByRole("region", { name: "Ma playlist" }).or(page.locator("#playlist-title").locator("..")),
    ).toContainText("Tolamuka");
  });
});

test.describe("Images", () => {
  test("aperçu filigrané, licence commerciale au triple du prix", async ({ page }) => {
    await page.goto("/fr/produit/pack-20-fonds-d-ecran");
    await expect(page.getByText("di.si store · aperçu").first()).toBeAttached();
    await page.getByRole("radio", { name: /Commerciale/ }).click();
    await expect(page.getByText("Licence : Commerciale")).toBeVisible();
    await page.getByRole("button", { name: "Ajouter au panier" }).click();
    await page.goto("/fr/panier");
    await expect(page.getByText("Licence : Commerciale")).toBeVisible();
    await expect(page.locator("main")).toContainText("5,37 $");
  });

  test("bibliothèque : « Télécharger en HD »", async ({ page }) => {
    await seed(page, {
      "ds-library": [{ slug: "motifs-kuba-vectoriels", at: Date.now(), paidUsdCents: 149 }],
    });
    await page.goto("/fr/bibliotheque");
    await expect(page.getByRole("button", { name: /Télécharger/ })).toHaveText("Télécharger en HD");
  });
});

test.describe("Actions communes", () => {
  test("signaler : motif obligatoire puis confirmation", async ({ page }) => {
    await page.goto("/fr/produit/rumba-douce");
    await page.getByRole("button", { name: "Signaler" }).click();
    await sheet(page).getByRole("button", { name: "Envoyer le signalement" }).click();
    await expect(sheet(page).getByText("Choisis un motif.")).toBeVisible();
    await sheet(page).getByLabel("Informations fausses").check();
    await sheet(page).getByRole("button", { name: "Envoyer le signalement" }).click();
    await expect(toastZone(page)).toContainText("Signalement envoyé");
    await expect(page.getByRole("button", { name: "Signalé" })).toBeVisible();
  });

  test("donner mon avis : note obligatoire, avis affiché", async ({ page }) => {
    await page.goto("/fr/produit/rumba-douce");
    await page.getByRole("button", { name: "Donner mon avis" }).click();
    await sheet(page).getByRole("button", { name: "Publier mon avis" }).click();
    await expect(sheet(page).getByText("Choisis une note de 1 à 5.")).toBeVisible();
    await sheet(page).getByRole("radio", { name: "4 sur 5" }).click();
    await sheet(page).getByLabel("Ton commentaire (facultatif)").fill("Très doux pour le soir.");
    await sheet(page).getByRole("button", { name: "Publier mon avis" }).click();
    await expect(toastZone(page)).toContainText("ton avis est publié");
    await expect(page.getByText("Très doux pour le soir.").filter({ visible: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Modifier mon avis" })).toBeVisible();
  });

  test("contacter le vendeur, ancienneté, récemment consultés", async ({ page }) => {
    await page.goto("/fr/produit/motifs-kuba-vectoriels");
    await expect(page.getByRole("link", { name: "Contacter le vendeur" })).toHaveAttribute(
      "href",
      /wa\.me\/243824176729\?text=.*Motifs/,
    );
    await expect(page.getByText("Vendeur depuis 2024")).toBeVisible();
    await page.goto("/fr");
    await expect(page.getByRole("heading", { name: "Récemment consultés" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Motifs Kuba/ }).first()).toBeVisible();
  });
});
