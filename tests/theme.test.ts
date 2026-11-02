import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CATEGORY_COLORS as CAT, COLORS as C } from "@/lib/theme";

const css = readFileSync("app/theme.css", "utf8");
const camel = (s: string) => s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

/** Ratio de contraste WCAG 2.x. */
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const ratio = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe("tokens : app/theme.css et lib/theme.ts sont identiques", () => {
  const defined = Object.fromEntries(
    [...css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{6})/g)].map(([, name, hex]) => [name, hex]),
  );
  it.each(Object.entries(C))("%s", (name, hex) => {
    const cssName = name.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
    expect(defined[cssName]).toBe(hex);
  });
  it.each(Object.entries(CAT))("catégorie %s", (name, hex) => {
    expect(defined["cat-" + name]).toBe(hex);
  });
  it("aucune couleur du CSS n'est absente du miroir", () => {
    const known = new Set([
      ...Object.keys(C),
      ...Object.keys(CAT).map((k) => "cat" + k[0].toUpperCase() + k.slice(1)),
    ]);
    expect(
      Object.keys(defined)
        .map(camel)
        .filter((k) => !known.has(k)),
    ).toEqual([]);
  });
});

/** Couples texte / fond réellement utilisés (AA : 4,5 ; icônes et grands textes : 3). */
const PAIRS: Array<[string, string, string, number]> = [
  ["texte principal / fond", C.textPrimary, C.background, 4.5],
  ["texte principal / carte", C.textPrimary, C.surface, 4.5],
  ["texte principal / relief", C.textPrimary, C.surfaceHigh, 4.5],
  ["texte secondaire / fond", C.textSecondary, C.background, 4.5],
  ["texte secondaire / carte", C.textSecondary, C.surface, 4.5],
  ["texte secondaire / relief", C.textSecondary, C.surfaceHigh, 4.5],
  ["bouton principal", C.onPrimary, C.primary, 4.5],
  ["bouton principal pressé", C.onPrimary, C.primaryPressed, 4.5],
  ["onglet actif (vert) / barre du bas", C.primary, C.surface, 4.5],
  ["promo (texte) / carte", C.promo, C.surface, 4.5],
  ["urgent (texte) / carte", C.urgentText, C.surface, 4.5],
  ["urgent (texte) / fond", C.urgentText, C.background, 4.5],
  ["confiance (texte) / carte", C.trust, C.surface, 4.5],
  ["premium (étoiles, texte) / carte", C.premium, C.surface, 4.5],
  ["succès (texte) / carte", C.success, C.surface, 4.5],
  ["badge promo (texte foncé)", C.onPrimary, C.promo, 4.5],
  ["badge urgent (texte foncé)", C.onPrimary, C.urgent, 4.5],
  ["badge confiance (texte foncé)", C.onPrimary, C.trust, 4.5],
  ["badge premium (texte foncé)", C.onPrimary, C.premium, 4.5],
  ["badge succès (texte foncé)", C.onPrimary, C.success, 4.5],
  ["contour des champs / carte (non textuel)", C.border, C.background, 1.3],
  ...Object.entries(CAT).map(
    ([k, hex]) =>
      [`puce catégorie ${k} (texte foncé)`, C.onPrimary, hex, 4.5] as [string, string, string, number],
  ),
  ...Object.entries(CAT).map(
    ([k, hex]) => [`icône catégorie ${k} / carte`, hex, C.surface, 3] as [string, string, string, number],
  ),
];

describe("contrastes AA de la charte di.si store", () => {
  it.each(PAIRS)("%s", (_, fg, bg, min) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(min);
  });
});

/** Fichiers où aucune couleur ne doit être écrite en dur. */
const STRICT_DIRS = ["components/ui"];
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.(tsx?|css)$/.test(p) ? [p] : [];
  });
}

describe("aucune couleur en dur hors du fichier de thème", () => {
  const offenders = STRICT_DIRS.flatMap(files).flatMap((f) => {
    const src = readFileSync(f, "utf8");
    const hits = [
      ...src.matchAll(
        /#[0-9a-fA-F]{3,8}\b(?![\w-])|\b(?:bg|text|border|ring|fill|stroke)-(?:white|black)\b|rgb\(/g,
      ),
    ].map((m) => `${f}: ${m[0]}`);
    return hits;
  });
  it("components/ui", () => {
    expect(offenders).toEqual([]);
  });
});
