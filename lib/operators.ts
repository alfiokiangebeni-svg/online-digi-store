/**
 * Détection de l'opérateur Mobile Money à partir du numéro (RDC, +243).
 * Préfixes issus de docs/PAIEMENT-MOBILE-MONEY.md — à confirmer avec l'agrégateur.
 */

export type OperatorId = "mpesa" | "orange" | "airtel" | "afrimoney";

export interface Operator {
  id: OperatorId;
  /** Nom commercial, identique dans toutes les langues. */
  name: string;
  /** Préfixes nationaux à deux chiffres (sans le 0). */
  prefixes: readonly string[];
}

export const OPERATORS: readonly Operator[] = [
  { id: "mpesa", name: "Vodacom M-Pesa", prefixes: ["81", "82", "83"] },
  { id: "orange", name: "Orange Money", prefixes: ["84", "85", "89"] },
  { id: "airtel", name: "Airtel Money", prefixes: ["97", "98", "99"] },
  { id: "afrimoney", name: "Africell Afrimoney", prefixes: ["90"] },
];

const COUNTRY_CODE = "243";
const NATIONAL_LENGTH = 9;

/**
 * Ramène une saisie libre aux chiffres du numéro national (sans 0 initial).
 * Accepte « +243 82 123 4567 », « 00243… », « 243… », « 082… », « 82… ».
 * Peut renvoyer un numéro partiel pendant la saisie.
 */
export function toNationalDigits(input: string): string {
  const international = /^\s*(\+|00)/.test(input);
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith(COUNTRY_CODE) && (international || digits.length > NATIONAL_LENGTH + 1)) {
    digits = digits.slice(COUNTRY_CODE.length);
  }
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, NATIONAL_LENGTH);
}

/** Opérateur dès que les deux premiers chiffres sont connus, sinon null. */
export function detectOperator(input: string): Operator | null {
  const national = toNationalDigits(input);
  if (national.length < 2) return null;
  const prefix = national.slice(0, 2);
  return OPERATORS.find((op) => op.prefixes.includes(prefix)) ?? null;
}

export interface ParsedPhone {
  operator: Operator;
  /** Format international E.164 : +243XXXXXXXXX */
  e164: string;
  /** Format d'affichage national : 082 123 4567 */
  display: string;
}

/** Numéro complet et valide, ou null. */
export function parsePhone(input: string): ParsedPhone | null {
  const national = toNationalDigits(input);
  if (national.length !== NATIONAL_LENGTH) return null;
  const operator = detectOperator(national);
  if (!operator) return null;
  return {
    operator,
    e164: `+${COUNTRY_CODE}${national}`,
    display: `0${national.slice(0, 2)} ${national.slice(2, 5)} ${national.slice(5)}`,
  };
}
