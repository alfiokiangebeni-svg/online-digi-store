/**
 * Codes promo de démonstration. En phase 2 : table `coupons` (admin + vendeurs).
 */
export interface Coupon {
  code: string;
  /** Remise en pourcentage… */
  percent?: number;
  /** …ou montant fixe en cents USD. */
  amountUsdCents?: number;
  minSubtotalUsdCents?: number;
}

export const DEMO_COUPONS: Coupon[] = [
  { code: "KIN2026", percent: 20 },
  { code: "ENFANT1", amountUsdCents: 100, minSubtotalUsdCents: 100 },
];

export type CouponResult = { ok: true; code: string; discountUsdCents: number } | { ok: false };

export function applyCoupon(input: string, subtotalUsdCents: number, coupons = DEMO_COUPONS): CouponResult {
  const code = input.trim().toUpperCase();
  const coupon = coupons.find((c) => c.code === code);
  if (!coupon || subtotalUsdCents <= 0) return { ok: false };
  if (coupon.minSubtotalUsdCents && subtotalUsdCents < coupon.minSubtotalUsdCents) return { ok: false };
  const raw = coupon.percent
    ? Math.round((subtotalUsdCents * coupon.percent) / 100)
    : (coupon.amountUsdCents ?? 0);
  return { ok: true, code, discountUsdCents: Math.min(raw, subtotalUsdCents) };
}
