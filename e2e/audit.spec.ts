import { expect, seed, test } from "./fixtures";

/**
 * Audit « aucun bouton sans action » : sur chaque écran principal, chaque bouton est
 * cliqué sur une page fraîche et doit produire un effet observable (navigation,
 * fenêtre, donnée enregistrée, réglage, écran mis à jour ou message). Seules exceptions :
 * une option déjà sélectionnée (aria-checked / aria-pressed / aria-current = true).
 * Chaque lien interne doit mener à une page existante.
 */
const SEED = {
  "ds-cart": [{ slug: "maths-en-s-amusant" }, { slug: "comptines-du-matin" }],
  "ds-library": [
    { slug: "rumba-douce", at: 1_800_000_000_000, paidUsdCents: 99 },
    { slug: "les-lettres-en-couleurs", at: 1_700_000_000_000, paidUsdCents: 0, downloaded: true },
  ],
  "ds-favorites": ["le-fleuve-et-nous"],
};

const SCREENS = [
  "/fr",
  "/fr/explorer",
  "/fr/categories",
  "/fr/categories/livres",
  "/fr/categories/immobilier",
  "/fr/vendre",
  "/fr/produit/maths-en-s-amusant",
  "/fr/produit/kinshasa-mode-emploi",
  "/fr/produit/rumba-douce",
  "/fr/panier",
  "/fr/bibliotheque",
  "/fr/compte",
  "/fr/lecteur?id=rumba-douce",
  "/fr/inconnu",
];

const SELECTOR = "main button, header button, [role=switch], [role=radio]";

for (const path of SCREENS) {
  test(`aucun bouton sans action : ${path}`, async ({ page, browser }) => {
    test.slow();
    await seed(page, SEED);
    await page.goto(path);
    // Attend l'hydratation : certains boutons (micro, scan) n'apparaissent qu'ensuite.
    await page.waitForLoadState("networkidle");
    // Rien ne dépasse la largeur de l'écran (pas de défilement horizontal).
    const widths = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
    expect(widths[0], "défilement horizontal").toBeLessThanOrEqual(widths[1]);
    const count = await page.locator(SELECTOR).count();
    const silent: string[] = [];

    for (let i = 0; i < count; i++) {
      const ctx = await browser.newContext({
        viewport: { width: 412, height: 915 },
        isMobile: true,
        hasTouch: true,
      });
      const p = await ctx.newPage();
      await p.addInitScript((v) => {
        if (sessionStorage.getItem("seeded")) return;
        for (const [k, val] of Object.entries(v)) localStorage.setItem(k, JSON.stringify(val));
        sessionStorage.setItem("seeded", "1");
      }, SEED);
      await p.goto(path);
      await p.waitForLoadState("networkidle");
      const el = p.locator(SELECTOR).nth(i);
      if (!(await el.isVisible())) {
        await ctx.close();
        continue;
      }
      const label = ((await el.getAttribute("aria-label")) ?? (await el.innerText()).trim()).slice(0, 50);
      const selected = await el.evaluate((e) =>
        ["aria-checked", "aria-pressed", "aria-current"].some(
          (a) => e.getAttribute(a) === "true" || e.getAttribute(a) === "page",
        ),
      );
      const snap = () =>
        p.evaluate(() => ({
          url: location.href,
          dom:
            document.body.innerHTML.length + ":" + (document.querySelector("main")?.textContent?.length ?? 0),
          ls: JSON.stringify(Object.entries(localStorage).sort()),
          dlg: document.querySelectorAll("dialog[open]").length,
          html: [...document.documentElement.attributes].map((a) => a.name + a.value).join(),
          toast: document.querySelector("div[role=status][aria-live=polite].fixed")?.textContent ?? "",
        }));
      const before = await snap();
      const popup = p.waitForEvent("popup", { timeout: 700 }).catch(() => null);
      // Clic réel (défilement compris) ; repli sur un clic DOM pour les éléments
      // masqués visuellement (sr-only) ou passés sous la barre d'achat fixe.
      await el.evaluate((e) => e.scrollIntoView({ block: "center" }));
      await el.click({ timeout: 2_000 }).catch(() => el.evaluate((e) => (e as HTMLElement).click()));
      // Attend une réaction jusqu'à 2 s (machine chargée), sans ralentir les cas rapides.
      let changed = false;
      for (let t = 0; t < 10 && !changed; t++) {
        await p.waitForTimeout(200);
        changed = JSON.stringify(before) !== JSON.stringify(await snap());
      }
      changed ||= (await popup) !== null;
      if (!changed && !selected) silent.push(label || `(bouton ${i})`);
      await ctx.close();
    }

    // Liens internes : la cible doit exister.
    const hrefs = await page
      .locator("a[href^='/']")
      .evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")!))]);
    const broken: string[] = [];
    for (const href of hrefs) {
      const r = await page.request.get(href);
      if (r.status() >= 400) broken.push(`${href} → ${r.status()}`);
    }

    expect(silent, "boutons sans effet").toEqual([]);
    expect(broken, "liens cassés").toEqual([]);
  });
}
