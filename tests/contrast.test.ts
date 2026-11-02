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
  ["texte sur fond citron", B.ink, B.lime, 4.5],
  ["texte sur carte blanche", B.ink, B.white, 4.5],
  ["texte secondaire sur citron", A.slate, B.lime, 4.5],
  ["texte secondaire sur carte", A.slate, B.white, 4.5],
  ["bouton principal noir", B.white, B.ink, 4.5],
  ["lien vert sur carte", B.leaf, B.white, 4.5],
  ["lien vert foncé sur citron", A.leafStrong, B.lime, 4.5],
  ["« Gratuit » sur carte", A.leafStrong, B.white, 4.5],
  ["bandeau d'info vert", A.leafStrong, A.mint, 4.5],
  ["remise blanche sur rouge", B.white, B.promo, 4.5],
  ["remise rouge sur carte", B.promo, B.white, 4.5],
  ["prix barré sur carte", "#6B7280", B.white, 4.5],
  ["accent citron sur bandeau noir", B.limeStrong, B.ink, 4.5],
  ["texte gris clair sur bandeau noir", A.steel, B.ink, 4.5],
  ["bouton citron", B.ink, B.limeStrong, 4.5],
  ["visuel latérite", "#9A3412", "#FDE4DA", 4.5],
  ["visuel vert", "#3F6212", "#DDF0C8", 4.5],
  ["visuel gris", "#3A3F47", A.cloud, 4.5],
  ["visuel sable", "#7A4D00", "#FFF4D6", 4.5],
];

describe("contrastes de la charte", () => {
  it.each(PAIRS)("%s", (_, fg, bg, min) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(min);
  });
});
