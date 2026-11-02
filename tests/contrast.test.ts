import { describe, expect, it } from "vitest";
import { ACCESSIBLE_VARIANTS as A, BRAND_COLORS as B } from "@/lib/brand";

/** Ratio de contraste WCAG 2.x entre deux couleurs hexadécimales. */
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Paires texte / fond réellement utilisées dans les composants (AA = 4,5 ; grand texte = 3). */
const PAIRS: Array<[string, string, string, number]> = [
  ["texte sombre", B.paper, B.ink, 4.5],
  ["texte clair", B.ink, B.paper, 4.5],
  ["texte secondaire sombre", B.cendre, B.ink, 4.5],
  ["texte secondaire sombre sur surface", B.cendre, A.surfaceDark, 4.5],
  ["texte secondaire clair", A.cendreStrong, B.paper, 4.5],
  ["texte secondaire clair sur surface", A.cendreStrong, A.surfaceLight, 4.5],
  ["prix / bouton payer", B.ink, B.taxi, 4.5],
  ["badge flash, compteur", B.paper, A.lateriteStrong, 4.5],
  ["badge livré", B.paper, B.fleuve, 4.5],
  ["texte vert sur sombre", A.fleuveBright, B.ink, 4.5],
  ["texte vert sur clair", B.fleuve, B.paper, 4.5],
  ["couverture latérite (titre ≥ 20 px gras)", B.paper, B.laterite, 3],
  ["couverture cendre", B.ink, B.cendre, 4.5],
  ["couverture fleuve", B.paper, B.fleuve, 4.5],
];

describe("contrastes de la charte", () => {
  it.each(PAIRS)("%s", (_, fg, bg, min) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(min);
  });
});
