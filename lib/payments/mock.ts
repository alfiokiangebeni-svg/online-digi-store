/**
 * Comportement de l'adaptateur `mock` (docs/PAIEMENT-MOBILE-MONEY.md).
 * Le dernier chiffre du numéro choisit l'issue, pour tester chaque cas d'échec :
 *   …1 → PIN refusé · …2 → solde insuffisant · …3 → délai dépassé · autre → payé.
 * L'interface PaymentProvider réelle arrive en phase 4 et reprendra ces issues.
 */
export type PaymentOutcome = "success" | "pin_refused" | "insufficient_funds" | "timeout";

export function mockOutcome(e164: string): PaymentOutcome {
  const last = e164.trim().slice(-1);
  if (last === "1") return "pin_refused";
  if (last === "2") return "insufficient_funds";
  if (last === "3") return "timeout";
  return "success";
}

/** Délai d'expiration d'une demande de paiement (secondes). */
export const PAYMENT_TIMEOUT_SECONDS = 120;
