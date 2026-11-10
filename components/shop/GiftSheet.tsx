"use client";

import { useState } from "react";
import { addToCart } from "@/lib/client/shop";
import { useLocalePath } from "@/lib/client/nav";
import { toast } from "@/lib/client/toast";
import { useFeedbackTexts } from "@/components/feedback/FeedbackProvider";
import { parsePhone } from "@/lib/operators";
import { Button } from "@/components/ui/Button";
import { PhoneField } from "@/components/ui/PhoneField";
import { Sheet } from "@/components/ui/Sheet";
import { IconGift } from "@/components/ui/icons";

/** « Offrir ce produit » : le cadeau part au numéro saisi après paiement. */
export function GiftSheet({
  slug,
  labels,
}: {
  slug: string;
  labels: {
    trigger: string;
    title: string;
    body: string;
    add: string;
    close: string;
    phoneLabel: string;
    phonePlaceholder: string;
    phoneHint: string;
    detected: string;
    unknown: string;
    invalid: string;
  };
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>();
  const t = useFeedbackTexts();
  const path = useLocalePath();
  return (
    <Sheet
      triggerLabel={labels.trigger}
      triggerIcon={<IconGift size={18} />}
      triggerVariant="ghost"
      triggerClassName="px-2"
      title={labels.title}
      closeLabel={labels.close}
    >
      {(close) => (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const phone = parsePhone(value);
            if (!phone) {
              setError(labels.invalid);
              return;
            }
            addToCart({ slug, giftTo: phone.e164 });
            toast({
              tone: "success",
              message: t.giftAdded,
              action: { label: t.viewCart, href: path("panier") },
            });
            setError(undefined);
            close();
          }}
        >
          <p className="text-muted">{labels.body}</p>
          <PhoneField
            id={`gift-${slug}`}
            label={labels.phoneLabel}
            placeholder={labels.phonePlaceholder}
            hint={labels.phoneHint}
            detectedTemplate={labels.detected}
            unknownText={labels.unknown}
            onValueChange={(v) => {
              setValue(v);
              setError(undefined);
            }}
            error={error}
          />
          <Button type="submit" variant="secondary" block icon={<IconGift size={18} />}>
            {labels.add}
          </Button>
        </form>
      )}
    </Sheet>
  );
}
