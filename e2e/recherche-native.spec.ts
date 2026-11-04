import { expect, test, toastZone } from "./fixtures";

/** Simule le pont Android « window.DisiNative » (voix, scan, vibration). */
async function fakeNative(page: import("@playwright/test").Page, voice: string | null, scan: string | null) {
  await page.addInitScript(
    ([v, s]) => {
      const calls: string[] = [];
      (window as unknown as { __calls: string[] }).__calls = calls;
      (window as unknown as { DisiNative: object }).DisiNative = {
        voice: (lang: string) => {
          calls.push(`voice:${lang}`);
          setTimeout(
            () => (v ? window.__disiVoice?.(v) : window.__disiNativeError?.("voice", "no-speech")),
            50,
          );
        },
        scan: () => {
          calls.push("scan");
          setTimeout(() => (s ? window.__disiScan?.(s) : window.__disiNativeError?.("scan", "failed")), 50);
        },
        vibrate: (ms: number) => calls.push(`vibrate:${ms}`),
      };
    },
    [voice, scan] as const,
  );
}

test("recherche vocale : le texte reconnu lance la recherche", async ({ page }) => {
  await fakeNative(page, "rumba", null);
  await page.goto("/fr");
  await page.getByRole("button", { name: "Recherche vocale" }).click();
  await expect(page).toHaveURL(/\/fr\/explorer\?q=rumba/);
  expect(await page.evaluate(() => (window as unknown as { __calls: string[] }).__calls)).toContain(
    "voice:fr-FR",
  );
});

test("recherche vocale : échec annoncé avec « Réessayer »", async ({ page }) => {
  await fakeNative(page, null, null);
  await page.goto("/fr/categories");
  await page.getByRole("button", { name: "Recherche vocale" }).click();
  await expect(toastZone(page)).toContainText("Je n'ai pas compris");
  await expect(toastZone(page).getByRole("button", { name: "Réessayer" })).toBeVisible();
});

test("scan : un QR code di.si store ouvre la fiche", async ({ page }) => {
  await fakeNative(page, null, "https://disistore.cd/fr/annonce/studio-meuble-lingwala/");
  await page.goto("/fr");
  await page.getByRole("button", { name: "Scanner un code" }).click();
  await expect(page).toHaveURL(/\/fr\/annonce\/studio-meuble-lingwala$/);
});

test("scan : un autre code lance une recherche", async ({ page }) => {
  await fakeNative(page, null, "9780000000000");
  await page.goto("/fr");
  await page.getByRole("button", { name: "Scanner un code" }).click();
  await expect(page).toHaveURL(/\/fr\/explorer\?q=9780000000000/);
});

test("vibration : l'achat passe par le pont natif", async ({ page }) => {
  await fakeNative(page, null, null);
  await page.goto("/fr/produit/maths-en-s-amusant");
  await page.getByRole("button", { name: "Ajouter au panier" }).click();
  expect(await page.evaluate(() => (window as unknown as { __calls: string[] }).__calls)).toContain(
    "vibrate:12",
  );
});

test("sans application ni micro, les boutons voix et scan sont masqués", async ({ page }) => {
  await page.addInitScript(() => {
    delete (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
    delete (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition;
  });
  await page.goto("/fr");
  await expect(page.getByRole("button", { name: "Scanner un code" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Recherche vocale" })).toHaveCount(0);
});
