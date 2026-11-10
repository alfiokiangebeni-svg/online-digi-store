"use client";

import { couponStore } from "@/lib/client/shop";
import { toast } from "@/lib/client/toast";
import { useFeedbackTexts } from "@/components/feedback/FeedbackProvider";
import { useStore } from "@/lib/client/store";
import { IconCheck } from "@/components/ui/icons";
import { cn } from "@/components/ui/cn";

/** Coupon à récupérer : il est ensuite appliqué tout seul dans le panier. */
export function CouponCard({
  code,
  value,
  condition,
  labels,
}: {
  code: string;
  /** Remise affichée (« −20 % », « −1 $ »). */
  value: string;
  condition: string;
  labels: { claim: string; claimed: string; code: string; auto: string };
}) {
  const claimed = useStore(couponStore) === code;
  const t = useFeedbackTexts();
  return (
    <div className="flex min-w-[15rem] shrink-0 items-stretch overflow-hidden rounded-[8px] border border-dashed border-gold bg-surface">
      <div className="grid w-20 shrink-0 place-items-center bg-gold-soft px-1 text-center text-lg font-extrabold leading-tight text-gold">
        {value}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1 px-3 py-2.5">
        <p className="text-[13px] font-semibold">{labels.code.replace("{code}", code)}</p>
        <p className="text-[11px] text-muted">{claimed ? labels.auto : condition}</p>
        <button
          type="button"
          aria-pressed={claimed}
          onClick={() => {
            couponStore.set(claimed ? null : code);
            toast({
              tone: "success",
              message: (claimed ? t.couponReleased : t.couponClaimed).replace("{code}", code),
            });
          }}
          className={cn(
            "mt-0.5 inline-flex h-8 items-center gap-1 self-start rounded-full px-3 text-xs font-bold",
            claimed ? "bg-success-soft text-success" : "btn-primary",
          )}
        >
          {claimed ? <IconCheck size={12} /> : null}
          {claimed ? labels.claimed : labels.claim}
        </button>
      </div>
    </div>
  );
}
