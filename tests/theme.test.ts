import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { COLORS as C } from "@/lib/theme";

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
  it("aucune couleur du CSS n'est absente du miroir", () => {
    const known = new Set<string>(Object.keys(C));
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
  ["logo dans la pastille vert citron", C.textPrimary, C.primary, 4.5],
  ["onglet actif (vert lisible) / barre du bas", C.primaryText, C.surface, 4.5],
  ["puce active (vert lisible) / relief", C.primaryText, C.surfaceHigh, 4.5],
  ["contour de focus / fond", C.primaryText, C.background, 3],
  ["rouge (petit texte) / carte", C.urgentText, C.surface, 4.5],
  ["rouge (petit texte) / fond", C.urgentText, C.background, 4.5],
  ["badge rouge pâle (texte rouge)", C.urgentText, C.urgentSoft, 4.5],
  ["bannière bleu nuit (texte blanc)", C.onAccent, C.night, 4.5],
  ["bannière bleu nuit (or champagne)", C.champagne, C.night, 4.5],
  ["bannière bleu nuit (bouton vert citron)", C.primary, C.night, 3],
  ["or (texte) / carte", C.gold, C.surface, 4.5],
  ["badge doré (texte or)", C.gold, C.goldSoft, 4.5],
  ["étoiles / carte (non textuel)", C.star, C.surface, 3],
  ["succès (texte) / carte", C.success, C.surface, 4.5],
  ["succès (texte) / relief", C.success, C.surfaceHigh, 4.5],
  ["badge succès pâle (texte vert)", C.success, C.successSoft, 4.5],
];

describe("contrastes AA de la charte di.si store", () => {
  it.each(PAIRS)("%s", (_, fg, bg, min) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(min);
  });
});

/** Fichiers où aucune couleur ne doit être écrite en dur (le thème est la seule source). */
const STRICT_DIRS = ["app", "components"];
const THEME_FILE = join("app", "theme.css");
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (p === THEME_FILE) return [];
    return statSync(p).isDirectory() ? files(p) : /\.(tsx?|css)$/.test(p) ? [p] : [];
  });
}
/** Anciens noms de couleur retirés à l'étape 4 : ne doivent plus réapparaître. */
const LEGACY =
  "ink|paper|lime|lime-strong|cta|cta-soft|mint|leaf|leaf-strong|link|cloud|slate|hint|hint-strong|steel|header|taxi|laterite|laterite-strong|fleuve|fleuve-bright|cendre|cendre-strong";
const PATTERN = new RegExp(
  [
    String.raw`#[0-9a-fA-F]{3,8}\b(?![\w-])`,
    String.raw`\b(?:bg|text|border|ring|fill|stroke)-(?:white|black)\b`,
    String.raw`rgba?\(`,
    String.raw`\bdark:`,
    String.raw`\b(?:bg|text|border|ring|fill|stroke|outline|decoration|from|to|backdrop:bg)-(?:${LEGACY})(?![\w-])`,
  ].join("|"),
  "g",
);

describe("aucune couleur en dur hors du fichier de thème", () => {
  const offenders = STRICT_DIRS.flatMap(files).flatMap((f) =>
    [...readFileSync(f, "utf8").matchAll(PATTERN)].map((m) => `${f}: ${m[0]}`),
  );
  it("app et components", () => {
    expect(offenders).toEqual([]);
  });
});
