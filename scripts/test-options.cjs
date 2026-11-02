#!/usr/bin/env node
/**
 * Vérifie toutes les options de la boutique dans un vrai navigateur mobile (Playwright) :
 * recherche, filtres, devise, coupons, ajout rapide, extraits audio, fiche produit,
 * cadeau, panier, paiements (échecs et succès), bibliothèque, contrôle parental et PIN,
 * thème, données légères, langues, 404, erreurs JavaScript.
 *
 * Contre le site embarqué dans l'APK :
 *   node scripts/serve-apk-site.mjs android/app/src/main/assets/www 4500 &
 *   node scripts/test-options.cjs http://localhost:4500
 *
 * Prérequis : Playwright et Chromium installés (npx playwright install chromium).
 */
const { chromium } = require("playwright");
const B = process.argv[2] || "http://localhost:4500";
const results = [];
const check = async (name, fn) => {
  try {
    const detail = await fn();
    results.push(["OK ", name, detail ?? ""]);
  } catch (e) {
    results.push(["ÉCHEC", name, String(e.message).split("\n")[0].slice(0, 140)]);
  }
};
const expect = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  const go = (u) => p.goto(B + u, { waitUntil: "networkidle" });
  const count = () => p.locator("p[aria-live]").first().textContent();
  const badge = () =>
    p
      .locator("header a[aria-label='Panier'] span span[aria-hidden]")
      .textContent()
      .catch(() => "0");

  await check("Accueil : chargement", async () => {
    await go("/fr/");
    expect(await p.locator("h1").textContent(), "pas de h1");
    return await p.title();
  });
  await check("Recherche depuis l'accueil (faute tolérée)", async () => {
    await p.fill("header input[name=q]", "kinshassa");
    await p.press("header input[name=q]", "Enter");
    await p.waitForURL(/explorer/);
    await p.waitForLoadState("networkidle");
    const c = await count();
    expect(/4 contenus/.test(c), c);
    return c;
  });
  await check("Filtre par type (Musique)", async () => {
    await go("/fr/explorer/?type=music");
    const c = await count();
    expect(/3 contenus/.test(c), c);
    return c;
  });
  await check("Filtre prix « Gratuits » + tri", async () => {
    await go("/fr/explorer/");
    await p.getByRole("radio", { name: "Gratuits" }).click();
    const c = await count();
    await p.getByRole("button", { name: /^Tri/ }).click();
    const t = await p.getByRole("button", { name: /^Tri/ }).textContent();
    expect(/5 contenus/.test(c) && /Prix croissant/.test(t), c + " / " + t);
    return c + " · " + t;
  });
  await check("Navigation par la barre du bas (sans rechargement)", async () => {
    await p.getByRole("link", { name: "Accueil", exact: true }).click();
    await p.waitForURL(/\/fr\/$/);
    await p
      .getByRole("navigation", { name: "Navigation principale" })
      .getByRole("link", { name: "Bibliothèque" })
      .click();
    await p.waitForURL(/bibliotheque/);
    expect((await p.locator("h1").textContent()) === "Bibliothèque", "h1");
  });
  await check("Retour arrière", async () => {
    await p.goBack();
    await p.waitForURL(/\/fr\/$/);
  });
  await check("Bascule $ / FC (gardée après rechargement)", async () => {
    await go("/fr/");
    await p.getByRole("radio", { name: "FC" }).click();
    await p.reload({ waitUntil: "networkidle" });
    const v = await p.locator(".cur-cdf .price-tag").first().isVisible();
    const u = await p.locator(".cur-usd .price-tag").first().isVisible();
    expect(v && !u, "devise");
    await p.getByRole("radio", { name: "$" }).click();
    return await p.locator(".cur-cdf .price-tag").first().textContent();
  });
  await check("Coupon « Récupérer »", async () => {
    await p.getByRole("button", { name: "Récupérer" }).first().click();
    expect((await p.getByRole("button", { name: "Récupéré" }).count()) === 1, "état");
  });
  await check("Ajout rapide au panier (grille)", async () => {
    await p.getByRole("button", { name: "Ajouter « Maths en s'amusant » au panier" }).first().click();
    const n = await badge();
    expect(n === "1", "badge=" + n);
    return "panier : " + n;
  });
  await check("Ajout rapide d'un gratuit → bibliothèque", async () => {
    await p.getByRole("button", { name: "Ajouter « Puzzle des animaux » au panier" }).first().click();
    expect((await p.getByRole("button", { name: "Ajouté au panier" }).count()) >= 1, "état");
  });
  await check("Extrait audio (lecture / pause)", async () => {
    const btn = p.getByRole("button", { name: /Écouter un extrait de Rumba douce/ });
    await btn.click();
    expect((await p.getByRole("button", { name: "Mettre en pause l'extrait" }).count()) === 1, "lecture");
    await p.getByRole("button", { name: "Mettre en pause l'extrait" }).click();
  });
  await check("Fiche produit : version, favori, partage WhatsApp", async () => {
    await go("/fr/produit/maths-en-s-amusant/");
    await p.getByRole("button", { name: "Windows" }).click();
    const size = await p.locator("fieldset p").textContent();
    await p.getByRole("button", { name: "Ajouter aux favoris" }).click();
    const href = await p.getByRole("link", { name: "Partager sur WhatsApp" }).getAttribute("href");
    expect(/120 Mo/.test(size) && href.startsWith("https://wa.me/"), size + " " + href);
    return size;
  });
  await check("Offrir à un numéro", async () => {
    await p.getByRole("button", { name: "Offrir" }).click();
    await p.fill("#gift-maths-en-s-amusant", "0991234567");
    await p.getByRole("button", { name: "Ajouter le cadeau au panier" }).click();
    return "badge " + (await badge());
  });
  await check("Acheter maintenant → panier", async () => {
    await p.getByRole("button", { name: "Acheter maintenant" }).click();
    await p.waitForURL(/panier/);
    await p.waitForLoadState("networkidle");
    return (await p.locator("main li").count()) + " lignes";
  });
  await check("Coupon récupéré appliqué automatiquement", async () => {
    const t = await p.getByText(/Code KIN2026 appliqué/).textContent();
    return t;
  });
  await check("Paiement : PIN refusé (numéro …1)", async () => {
    await p.fill("#pay-phone", "0824176721");
    await p.getByRole("button", { name: /^Payer/ }).click();
    await p.waitForTimeout(5200);
    const t = await p.locator("dialog[open] [role=status]").textContent();
    expect(/Code incorrect/.test(t), t);
    await p.getByRole("button", { name: "Annuler" }).click();
  });
  await check("Paiement : solde insuffisant (numéro …2)", async () => {
    await p.fill("#pay-phone", "0824176722");
    await p.getByRole("button", { name: /^Payer/ }).click();
    await p.waitForTimeout(5200);
    const t = await p.locator("dialog[open] [role=status]").textContent();
    expect(/Solde insuffisant/.test(t), t);
    await p.getByRole("button", { name: "Annuler" }).click();
  });
  await check("Paiement réussi → tampon LIVRÉ", async () => {
    await p.fill("#pay-phone", "0824176729");
    await p.getByRole("button", { name: /^Payer/ }).click();
    await p.waitForTimeout(5200);
    const t = await p.locator("dialog[open] [role=status]").textContent();
    expect(/Paiement reçu/.test(t), t);
    return t.slice(0, 70);
  });
  await check("Bibliothèque : bandeau + téléchargement", async () => {
    await p.getByRole("link", { name: "Ouvrir ma bibliothèque" }).click();
    await p.waitForURL(/bibliotheque/);
    await p.waitForLoadState("networkidle");
    const banner = await p.locator("main [role=status] p").first().textContent();
    await p.getByRole("button", { name: /Télécharger — Maths/ }).click();
    await p.waitForTimeout(3500);
    expect((await p.getByText("Disponible hors-ligne").count()) >= 1, "hors-ligne");
    return banner;
  });
  await check("Compte : contrôle parental + code PIN", async () => {
    await go("/fr/compte/");
    await p.getByRole("switch", { name: "Contrôle parental" }).click();
    await p.getByRole("button", { name: "3 ans" }).click();
    await p.fill("#pin", "1234");
    await p.getByRole("button", { name: "Enregistrer" }).click();
    expect((await p.getByText("Code enregistré.").count()) === 1, "pin");
  });
  await check("Contrôle parental : Explorer filtré (≤ 3 ans)", async () => {
    await go("/fr/explorer/");
    const c = await count();
    expect(/4 contenus/.test(c), c);
    return c;
  });
  await check("Contrôle parental : code demandé avant paiement", async () => {
    await go("/fr/produit/vendre-sur-whatsapp/");
    await p.getByRole("button", { name: "Acheter maintenant" }).click();
    await p.waitForURL(/panier/);
    await p.waitForLoadState("networkidle");
    await p.fill("#pay-phone", "0824176729");
    await p.getByRole("button", { name: /^Payer/ }).click();
    await p.fill("#parental-pin", "0000");
    await p.getByRole("button", { name: "Valider" }).click();
    expect((await p.getByText("Code incorrect.").count()) === 1, "mauvais code");
    await p.fill("#parental-pin", "1234");
    await p.getByRole("button", { name: "Valider" }).click();
    await p.waitForTimeout(5200);
    const t = await p.locator("dialog[open] [role=status]").textContent();
    expect(/Paiement reçu/.test(t), t);
  });
  await check("Thème sombre (gardé après rechargement)", async () => {
    await go("/fr/compte/");
    await p.getByRole("radio", { name: "Sombre" }).click();
    await p.reload({ waitUntil: "networkidle" });
    expect((await p.evaluate(() => document.documentElement.dataset.theme)) === "dark", "thème");
    await p.getByRole("radio", { name: "Clair" }).click();
  });
  await check("Données légères", async () => {
    await p.getByRole("switch", { name: "Données légères" }).click();
    expect(await p.evaluate(() => document.documentElement.hasAttribute("data-lite")), "lite");
    await p.getByRole("switch", { name: "Données légères" }).click();
  });
  await check("Langue : lingala", async () => {
    await p.getByRole("link", { name: "Lingála" }).first().click();
    await p.waitForURL(/\/ln\//);
    await p.waitForLoadState("networkidle");
    return await p.evaluate(() => document.documentElement.lang);
  });
  await check("Langue : anglais", async () => {
    await go("/en/");
    return await p.locator("h1").textContent();
  });
  await check("Page introuvable", async () => {
    const r = await p.goto(B + "/fr/nimporte/");
    expect(r.status() === 404, "status " + r.status());
  });
  await check("Aucune erreur JavaScript", async () => {
    expect(errors.filter((e) => !/404/.test(e)).length === 0, errors.join(" | "));
  });

  for (const [s, n, d] of results) console.log(`${s}  ${n}${d ? "  — " + d : ""}`);
  console.log(`\n${results.filter((r) => r[0] === "OK ").length}/${results.length} options OK`);
  await b.close();
})();
