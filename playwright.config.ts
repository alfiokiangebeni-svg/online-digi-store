import { defineConfig, devices } from "@playwright/test";

/**
 * Tests de bout en bout : un test par bouton important (achat, panier, paiement,
 * favoris, partage, filtres, retour, 404, hors-ligne…), sur téléphone émulé.
 * Prérequis : `npm run build`. Le serveur de production est lancé automatiquement.
 */
const PORT = Number(process.env.E2E_PORT ?? 3210);

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]]
    : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices["Pixel 7"],
    locale: "fr-FR",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/fr`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
