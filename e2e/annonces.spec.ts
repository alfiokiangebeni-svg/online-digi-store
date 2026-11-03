import { expect, test, toastZone } from "./fixtures";

const sheet = (page: import("@playwright/test").Page) => page.locator("dialog[open]");

test.describe("Immobilier", () => {
  test("filtres : type, meublé, tri par prix", async ({ page }) => {
    await page.goto("/fr/categories/immobilier");
    await expect(page.getByText("5 annonces")).toBeVisible();
    await page.getByRole("group", { name: "Type de bien" }).getByRole("button", { name: "Maison" }).click();
    await expect(page.getByText("1 annonces")).toBeVisible();
    await page.getByRole("group", { name: "Type de bien" }).getByRole("button", { name: "Tout" }).click();
    await page.getByRole("button", { name: "Meublé" }).click();
    await expect(page.getByText("4 annonces")).toBeVisible();
    await page.getByRole("button", { name: /^Tri/ }).click();
    await expect(page.getByRole("button", { name: "Tri : Prix croissant" })).toBeVisible();
    await expect(page.locator("main li").first()).toContainText("Studio meublé");
  });

  test("réserver une visite : numéro vérifié, confirmation, suivi dans Compte", async ({ page }) => {
    await page.goto("/fr/annonce/appartement-2-chambres-gombe");
    await page.getByRole("button", { name: "Réserver une visite" }).click();
    await sheet(page).getByRole("button", { name: "11 h – 13 h" }).click();
    await sheet(page).getByRole("button", { name: "Confirmer la visite" }).click();
    await expect(sheet(page).getByText("Numéro incomplet", { exact: false })).toBeVisible();
    await sheet(page).getByLabel("Ton numéro").fill("0821234567");
    await sheet(page).getByRole("button", { name: "Confirmer la visite" }).click();
    await expect(sheet(page).getByText("Réservé")).toBeVisible();
    await sheet(page).getByRole("link", { name: "Voir mes activités" }).click();
    await expect(page).toHaveURL(/\/fr\/compte#activites$/);
    await expect(page.locator("#activites")).toContainText("Appartement 2 chambres");
    await expect(page.locator("#activites")).toContainText("À confirmer");
  });

  test("payer la caution en Mobile Money", async ({ page }) => {
    await page.goto("/fr/annonce/studio-meuble-lingwala");
    await page.getByRole("button", { name: "Payer la caution" }).click();
    await sheet(page).getByLabel("Numéro Mobile Money").fill("0821234567");
    await sheet(page)
      .getByRole("button", { name: /^Payer/ })
      .click();
    await expect(page.getByText("Caution payée")).toBeVisible({ timeout: 10_000 });
    await page.goto("/fr/compte");
    await expect(page.locator("#activites")).toContainText("Caution payée");
  });

  test("carte, vidéo bientôt, contact WhatsApp, alerte", async ({ page }) => {
    await page.goto("/fr/annonce/maison-3-chambres-ngaliema");
    await expect(page.getByRole("link", { name: "Voir sur la carte" })).toHaveAttribute(
      "href",
      /google\.com\/maps\/search\/.*Ngaliema/,
    );
    await expect(page.getByRole("link", { name: "Contacter sur WhatsApp" })).toHaveAttribute(
      "href",
      /wa\.me\/243824176729\?text=/,
    );
    await page.getByRole("button", { name: /Visite vidéo/ }).click();
    await expect(toastZone(page)).toContainText("bientôt disponible");
    await page.getByRole("switch", { name: "Alerte nouvelle annonce" }).click();
    await expect(toastZone(page)).toContainText("Alerte activée");
  });
});

test.describe("Offres d'emploi", () => {
  test("postuler : champs obligatoires puis candidature envoyée", async ({ page }) => {
    await page.goto("/fr/annonce/comptable-confirme-gombe");
    await page.getByRole("button", { name: "Postuler" }).click();
    await sheet(page).getByRole("button", { name: "Envoyer ma candidature" }).click();
    await expect(sheet(page).getByText("Indique ton nom.")).toBeVisible();
    await expect(sheet(page).getByText("Ajoute ton CV.")).toBeVisible();
    await sheet(page).getByLabel("Nom complet").fill("Ami Kabeya");
    await sheet(page).getByLabel("Ton numéro").fill("0991234567");
    await sheet(page)
      .getByLabel("CV (PDF, Word ou photo)")
      .setInputFiles({ name: "cv.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4") });
    await expect(sheet(page).getByText("Fichier choisi : cv.pdf")).toBeVisible();
    await sheet(page).getByRole("button", { name: "Envoyer ma candidature" }).click();
    await expect(sheet(page).getByRole("paragraph").filter({ hasText: "Candidature envoyée" })).toBeVisible();
    await sheet(page).getByRole("button", { name: "Fermer" }).click();
    await expect(page.getByRole("button", { name: "Candidature envoyée" })).toBeVisible();
  });

  test("envoyer mon CV, sauvegarder l'offre, filtres contrat et télétravail", async ({ page }) => {
    await page.goto("/fr/annonce/developpeur-mobile-teletravail");
    await page.getByRole("button", { name: "Envoyer mon CV" }).click();
    await sheet(page).getByLabel("Nom complet").fill("Ami Kabeya");
    await sheet(page).getByLabel("Ton numéro").fill("0991234567");
    await sheet(page)
      .getByLabel("CV (PDF, Word ou photo)")
      .setInputFiles({ name: "cv.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF") });
    await sheet(page).getByRole("button", { name: "Envoyer mon CV" }).click();
    await expect(sheet(page).getByText("CV envoyé à Mbote Tech")).toBeVisible();
    await sheet(page).getByRole("button", { name: "Fermer" }).click();

    await page.getByRole("button", { name: "Sauvegarder l'offre" }).click();
    await expect(page.getByRole("button", { name: "Offre sauvegardée" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.goto("/fr/compte");
    await expect(page.locator("#activites")).toContainText("Offres et annonces sauvegardées");
    await expect(page.locator("#activites")).toContainText("CV envoyé");

    await page.goto("/fr/categories/emplois");
    await page
      .getByRole("group", { name: "Lieu de travail" })
      .getByRole("button", { name: "Télétravail" })
      .click();
    await expect(page.getByText("1 annonces")).toBeVisible();
  });
});

test.describe("Appels d'offres", () => {
  test("cahier des charges, question, soumission complète", async ({ page }) => {
    await page.goto("/fr/annonce/fourniture-kits-solaires-ecoles");
    await expect(page.getByRole("link", { name: "Poser une question" })).toHaveAttribute(
      "href",
      /AO-2026-014/,
    );
    await page.getByRole("link", { name: "Télécharger le cahier des charges" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("kits solaires");
    await expect(page.getByText("Délai d'exécution : 90 jours")).toBeVisible();
    await page.getByRole("link", { name: "Retour" }).click();

    await page.getByRole("button", { name: "Soumissionner" }).click();
    const s = sheet(page);
    await s.getByRole("button", { name: "Déposer mon offre" }).click();
    await expect(s.getByText("Coche tous les documents requis.")).toBeVisible();
    await s.getByLabel("Nom de l'entreprise").fill("Solaire Kin SARL");
    await s.getByLabel("Montant proposé (USD)").fill("52000");
    for (const box of await s.getByRole("checkbox").all()) await box.check();
    await s.getByLabel("Ton numéro").fill("0811234567");
    await s.getByRole("button", { name: "Déposer mon offre" }).click();
    await expect(s.getByText("Référence AO-2026-014 · statut : en cours d'examen.")).toBeVisible();
    await page.goto("/fr/compte");
    await expect(page.locator("#activites")).toContainText("En cours d'examen");
  });

  test("acheteur : demander un devis et publier un appel d'offres", async ({ page }) => {
    await page.goto("/fr/categories/appels-d-offres");
    await page.getByRole("button", { name: "Demander un devis" }).click();
    await sheet(page).getByLabel("Ton besoin").fill("Impression de 500 brochures A5");
    await sheet(page).getByLabel("Ton numéro").fill("0821234567");
    await sheet(page).getByRole("button", { name: "Envoyer la demande" }).click();
    await expect(sheet(page).getByText(/Demande de devis envoyée/)).toBeVisible();
    await sheet(page).getByRole("button", { name: "Fermer" }).click();
    await page.getByRole("link", { name: "Publier un appel d'offres" }).click();
    await expect(page).toHaveURL(/\/fr\/vendre\?categorie=tenders$/);
  });
});

test("recherche globale : les annonces apparaissent sous les produits", async ({ page }) => {
  await page.goto("/fr/explorer?q=gombe");
  await expect(page.getByRole("heading", { name: /Annonces/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Comptable confirmé/ })).toBeVisible();
});
