import { describe, expect, it } from "vitest";
import { format } from "@/lib/i18n/format";
import { isLocale, localePath } from "@/lib/i18n/config";
import fr from "@/lib/i18n/dictionaries/fr.json";
import en from "@/lib/i18n/dictionaries/en.json";
import ln from "@/lib/i18n/dictionaries/ln.json";

function keys(obj: object, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}
function placeholders(obj: object): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  const walk = (o: object, p: string) =>
    Object.entries(o).forEach(([k, v]) =>
      typeof v === "string" ? (out[p + k] = (v.match(/\{\w+\}/g) ?? []).sort()) : walk(v, `${p}${k}.`),
    );
  walk(obj, "");
  return out;
}

describe("dictionnaires", () => {
  const ref = keys(fr).sort();
  it.each([
    ["en", en],
    ["ln", ln],
  ])("%s a exactement les mêmes clés que fr", (_, dict) => {
    expect(keys(dict).sort()).toEqual(ref);
  });

  it.each([
    ["en", en],
    ["ln", ln],
  ])("%s garde les mêmes variables {…} que fr", (_, dict) => {
    expect(placeholders(dict)).toEqual(placeholders(fr));
  });

  it("aucun texte vide", () => {
    for (const dict of [fr, en, ln]) {
      const empty = Object.entries(placeholders(dict)).filter(([k]) => {
        const v = k.split(".").reduce<unknown>((o, part) => (o as Record<string, unknown>)[part], dict);
        return typeof v === "string" && v.trim() === "";
      });
      expect(empty).toEqual([]);
    }
  });
});

describe("format", () => {
  it("remplace les variables connues et laisse les autres", () => {
    expect(format("par {seller}", { seller: "L'auteur" })).toBe("par L'auteur");
    expect(format("{a} et {b}", { a: 1 })).toBe("1 et {b}");
  });
});

describe("config", () => {
  it("reconnaît les langues et construit les chemins", () => {
    expect(isLocale("ln")).toBe(true);
    expect(isLocale("de")).toBe(false);
    expect(localePath("fr")).toBe("/fr");
    expect(localePath("en", "/design")).toBe("/en/design");
  });
});
