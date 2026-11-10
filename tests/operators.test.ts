import { describe, expect, it } from "vitest";
import { detectOperator, parsePhone, toNationalDigits } from "@/lib/operators";

describe("toNationalDigits", () => {
  it.each([
    ["082 123 4567", "821234567"],
    ["0821234567", "821234567"],
    ["821234567", "821234567"],
    ["+243 82 123 4567", "821234567"],
    ["+243821234567", "821234567"],
    ["00243821234567", "821234567"],
    ["243821234567", "821234567"],
    ["(+243) 82-123-45-67", "821234567"],
  ])("%s → %s", (input, expected) => {
    expect(toNationalDigits(input)).toBe(expected);
  });

  it("garde un numéro partiel pendant la saisie", () => {
    expect(toNationalDigits("+243 8")).toBe("8");
    expect(toNationalDigits("09")).toBe("9");
  });
});

describe("detectOperator", () => {
  it.each([
    ["081", "mpesa"],
    ["082", "mpesa"],
    ["083", "mpesa"],
    ["084", "orange"],
    ["085", "orange"],
    ["089", "orange"],
    ["097", "airtel"],
    ["098", "airtel"],
    ["099", "airtel"],
    ["090", "afrimoney"],
    ["+243 99", "airtel"],
  ])("%s → %s", (input, id) => {
    expect(detectOperator(input)?.id).toBe(id);
  });

  it("renvoie null tant que le préfixe est incomplet ou inconnu", () => {
    expect(detectOperator("")).toBeNull();
    expect(detectOperator("0")).toBeNull();
    expect(detectOperator("08")).toBeNull();
    expect(detectOperator("086")).toBeNull();
    expect(detectOperator("091")).toBeNull();
  });
});

describe("parsePhone", () => {
  it("valide un numéro complet", () => {
    expect(parsePhone("0824176729")).toEqual({
      operator: expect.objectContaining({ id: "mpesa" }),
      e164: "+243824176729",
      display: "082 417 6729",
    });
  });

  it("refuse un numéro trop court ou un préfixe inconnu", () => {
    expect(parsePhone("08241767")).toBeNull();
    expect(parsePhone("0861234567")).toBeNull();
  });
});
