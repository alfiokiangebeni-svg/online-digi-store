/**
 * Devises. Le prix de référence est stocké en cents USD (entier).
 * Le CDF est calculé avec le taux du jour puis arrondi (50 CDF par défaut).
 */

import type { Locale } from "@/lib/i18n/config";

export type Currency = "USD" | "CDF";

/** Taux de démonstration tant que la tâche planifiée (phase 2) n'existe pas. */
export const DEMO_USD_TO_CDF_RATE = 2850;
export const DEFAULT_CDF_ROUNDING = 50;

/** Convertit des cents USD en francs congolais entiers, arrondis au pas donné. */
export function usdCentsToCdf(
  usdCents: number,
  rate: number,
  rounding: number = DEFAULT_CDF_ROUNDING,
): number {
  if (!Number.isInteger(usdCents) || usdCents < 0) {
    throw new RangeError("usdCents doit être un entier positif");
  }
  if (!(rate > 0)) throw new RangeError("Le taux doit être strictement positif");
  if (!Number.isInteger(rounding) || rounding < 1) {
    throw new RangeError("L'arrondi doit être un entier ≥ 1");
  }
  // Calcul en entiers pour éviter les erreurs de virgule flottante.
  const raw = (usdCents * Math.round(rate * 100)) / 10000;
  return Math.round(raw / rounding) * rounding;
}

const INTL_TAG: Record<Locale, string> = { fr: "fr-CD", ln: "ln-CD", en: "en-US" };

/** Formate un montant : cents pour USD, unités entières pour CDF. */
export function formatMoney(amount: number, currency: Currency, locale: Locale): string {
  const tag = INTL_TAG[locale];
  if (currency === "USD") {
    const n = new Intl.NumberFormat(tag, {
      minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amount / 100);
    return locale === "en" ? `$${n}` : `${n} $`;
  }
  const n = new Intl.NumberFormat(tag, { maximumFractionDigits: 0 }).format(amount);
  return `${n} FC`;
}

/** Pourcentage de remise arrondi, pour le badge promo. */
export function discountPercent(priceCents: number, promoCents: number): number {
  if (promoCents >= priceCents || priceCents <= 0) return 0;
  return Math.round(((priceCents - promoCents) / priceCents) * 100);
}
