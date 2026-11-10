import { describe, expect, it } from "vitest";
import { allowedForAge, CATALOG, effectivePrice, getProduct, isFree } from "@/lib/catalog";
import { applyCoupon } from "@/lib/coupons";
import { mockOutcome } from "@/lib/payments/mock";
import { distance, matches, normalize } from "@/lib/search";
import { nextFridayNight } from "@/lib/time";

describe("recherche", () => {
  it("normalise accents, apostrophes et casse", () => {
    expect(normalize("Maths en S’amusant !")).toBe("maths en s amusant");
    expect(normalize("Éducatif")).toBe("educatif");
  });

  it("distance de Levenshtein bornée", () => {
    expect(distance("rumba", "rumba")).toBe(0);
    expect(distance("rumab", "rumba")).toBe(2);
    expect(distance("kinshassa", "kinshasa")).toBe(1);
    expect(distance("a", "abcdef", 2)).toBe(3);
  });

  it("tolère les fautes de frappe et les préfixes", () => {
    const text = "Kinshasa, mode d'emploi L'auteur Livre";
    expect(matches("kinshassa", text)).toBe(true);
    expect(matches("kin", text)).toBe(true);
    expect(matches("emploie", text)).toBe(true);
    expect(matches("livre kinshasa", text)).toBe(true);
    expect(matches("musique", text)).toBe(false);
    expect(matches("", text)).toBe(true);
  });

  it("ne tolère aucune faute sur les mots très courts", () => {
    expect(matches("pdg", "PDF · 30 pages")).toBe(false);
  });
});

describe("codes promo", () => {
  it("applique un pourcentage arrondi", () => {
    expect(applyCoupon("kin2026", 1000)).toEqual({ ok: true, code: "KIN2026", discountUsdCents: 200 });
    expect(applyCoupon(" KIN2026 ", 499)).toEqual({ ok: true, code: "KIN2026", discountUsdCents: 100 });
  });

  it("applique un montant fixe sans dépasser le sous-total", () => {
    expect(applyCoupon("ENFANT1", 549)).toEqual({ ok: true, code: "ENFANT1", discountUsdCents: 100 });
    expect(applyCoupon("ENFANT1", 99)).toEqual({ ok: false });
  });

  it("refuse un code inconnu ou un panier vide", () => {
    expect(applyCoupon("FAUX", 1000)).toEqual({ ok: false });
    expect(applyCoupon("KIN2026", 0)).toEqual({ ok: false });
  });
});

describe("adaptateur de paiement mock", () => {
  it.each([
    ["+243824176721", "pin_refused"],
    ["+243824176722", "insufficient_funds"],
    ["+243824176723", "timeout"],
    ["+243824176729", "success"],
    ["+243990000000", "success"],
  ])("%s → %s", (phone, outcome) => {
    expect(mockOutcome(phone)).toBe(outcome);
  });
});

describe("fin des offres de la semaine", () => {
  const kin = (iso: string) => Date.parse(iso);
  it("vendredi 23 h 59 heure de Kinshasa (22 h 59 UTC)", () => {
    // Lundi 2 novembre 2026, 10 h à Kinshasa
    expect(new Date(nextFridayNight(kin("2026-11-02T09:00:00Z"))).toISOString()).toBe(
      "2026-11-06T22:59:00.000Z",
    );
  });
  it("le vendredi soir après l'échéance, passe à la semaine suivante", () => {
    expect(new Date(nextFridayNight(kin("2026-11-06T23:30:00Z"))).toISOString()).toBe(
      "2026-11-13T22:59:00.000Z",
    );
  });
  it("le vendredi avant l'échéance, reste le jour même", () => {
    expect(new Date(nextFridayNight(kin("2026-11-06T12:00:00Z"))).toISOString()).toBe(
      "2026-11-06T22:59:00.000Z",
    );
  });
});

describe("catalogue", () => {
  it("slugs uniques et URL-compatibles", () => {
    const slugs = CATALOG.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/));
  });

  it("prix cohérents : entiers, promo inférieure au prix", () => {
    for (const p of CATALOG) {
      expect(Number.isInteger(p.priceUsdCents)).toBe(true);
      if (p.promoUsdCents !== undefined) expect(p.promoUsdCents).toBeLessThan(p.priceUsdCents);
    }
  });

  it("prix effectif et gratuité", () => {
    const maths = getProduct("maths-en-s-amusant")!;
    expect(effectivePrice(maths)).toBe(149);
    expect(isFree(getProduct("berceuse-au-piano")!)).toBe(true);
  });

  it("contrôle parental : seuls les contenus classés et adaptés passent", () => {
    expect(allowedForAge({ age: [3, 6] }, 6)).toBe(true);
    expect(allowedForAge({ age: [5, 8] }, 3)).toBe(false);
    expect(allowedForAge({}, 12)).toBe(false);
  });
});
