import { describe, expect, it } from "vitest";
import { discountPercent, formatMoney, usdCentsToCdf } from "@/lib/currency";

const plain = (s: string) => s.replace(/[  ]/g, " ");

describe("usdCentsToCdf", () => {
  it("convertit et arrondit à 50 CDF", () => {
    expect(usdCentsToCdf(100, 2850)).toBe(2850);
    expect(usdCentsToCdf(499, 2850)).toBe(14200); // 14 221,5 → 14 200
    expect(usdCentsToCdf(699, 2850)).toBe(19900); // 19 921,5 → 19 900
    expect(usdCentsToCdf(1, 2850)).toBe(50); // 28,5 → 50
    expect(usdCentsToCdf(0, 2850)).toBe(0);
  });

  it("gère un taux décimal sans erreur de virgule flottante", () => {
    expect(usdCentsToCdf(1000, 2849.75, 1)).toBe(28498); // 28 497,5 → 28 498
  });

  it("accepte un autre pas d'arrondi", () => {
    expect(usdCentsToCdf(499, 2850, 100)).toBe(14200);
    expect(usdCentsToCdf(499, 2850, 500)).toBe(14000);
  });

  it("rejette les entrées invalides", () => {
    expect(() => usdCentsToCdf(-1, 2850)).toThrow(RangeError);
    expect(() => usdCentsToCdf(1.5, 2850)).toThrow(RangeError);
    expect(() => usdCentsToCdf(100, 0)).toThrow(RangeError);
    expect(() => usdCentsToCdf(100, 2850, 0)).toThrow(RangeError);
  });
});

describe("formatMoney", () => {
  it("USD selon la langue", () => {
    expect(plain(formatMoney(499, "USD", "fr"))).toBe("4,99 $");
    expect(plain(formatMoney(1000, "USD", "fr"))).toBe("10 $");
    expect(plain(formatMoney(499, "USD", "en"))).toBe("$4.99");
  });

  it("CDF sans décimales, suffixe FC", () => {
    expect(plain(formatMoney(14200, "CDF", "fr"))).toBe("14 200 FC");
    expect(plain(formatMoney(14200, "CDF", "en"))).toBe("14,200 FC");
  });
});

describe("discountPercent", () => {
  it("calcule la remise arrondie", () => {
    expect(discountPercent(699, 499)).toBe(29);
    expect(discountPercent(1500, 1200)).toBe(20);
    expect(discountPercent(500, 500)).toBe(0);
    expect(discountPercent(500, 600)).toBe(0);
  });
});
