"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { PhoneField } from "@/components/ui/PhoneField";
import { Sheet } from "@/components/ui/Sheet";
import type { ButtonVariant } from "@/components/ui/buttonStyles";
import { IconPhone } from "@/components/ui/icons";
import { recordActivity, type Activity } from "@/lib/client/activity";
import { parentalStore } from "@/lib/client/shop";
import { useStore } from "@/lib/client/store";
import { parsePhone, type ParsedPhone } from "@/lib/operators";
import { PaymentFlow, type PaymentLabels } from "./PaymentFlow";

export interface PayTexts {
  trigger: string;
  title: string;
  intro: string;
  pay: string;
  successTitle: string;
  successBody: string;
  doneLabel: string;
  phoneLabel: string;
  phonePlaceholder: string;
  phoneHint: string;
  detected: string;
  unknown: string;
  invalid: string;
  close: string;
}

/**
 * Paiement Mobile Money d'un montant isolé (caution, acompte, mise en avant) :
 * numéro → même parcours simulé que le panier (envoi, PIN, succès ou échec + Réessayer).
 */
export function MobileMoneyPay({
  id,
  amount,
  texts: t,
  payment,
  doneHref,
  variant = "outline",
  icon,
  className,
  activity,
  onPaid,
  hideTrigger,
}: {
  id: string;
  amount: ReactNode;
  texts: PayTexts;
  payment: PaymentLabels;
  doneHref: string;
  variant?: ButtonVariant;
  icon?: ReactNode;
  className?: string;
  /** Démarche enregistrée dans « Mes activités » après paiement. */
  activity?: Omit<Activity, "id" | "at">;
  onPaid?: () => void;
  /** Masque le bouton (déjà payé) sans couper l'écran de confirmation en cours. */
  hideTrigger?: boolean;
}) {
  const parental = useStore(parentalStore);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>();
  const [phone, setPhone] = useState<ParsedPhone | null>(null);

  return (
    <>
      {hideTrigger ? null : (
        <Sheet
          triggerLabel={t.trigger}
          triggerVariant={variant}
          triggerIcon={icon ?? <IconPhone size={18} />}
          triggerClassName={className}
          title={t.title}
          closeLabel={t.close}
        >
          {(close) => (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const parsed = parsePhone(value);
                if (!parsed) return setError(t.invalid);
                close();
                setPhone(parsed);
              }}
            >
              <p className="text-sm text-muted">{t.intro}</p>
              <PhoneField
                id={`pay-${id}`}
                label={t.phoneLabel}
                placeholder={t.phonePlaceholder}
                hint={t.phoneHint}
                detectedTemplate={t.detected}
                unknownText={t.unknown}
                onValueChange={(v) => {
                  setValue(v);
                  setError(undefined);
                }}
                error={error}
              />
              <Button type="submit" block haptic>
                {t.pay}
              </Button>
            </form>
          )}
        </Sheet>
      )}
      {phone ? (
        <PaymentFlow
          phone={phone}
          pin={parental.enabled ? parental.pin : null}
          total={amount}
          count={1}
          gifts={[]}
          libraryHref={doneHref}
          labels={{ ...payment, success: t.successTitle, successBody: t.successBody, goLibrary: t.doneLabel }}
          onSuccess={() => {
            if (activity) recordActivity(activity);
            onPaid?.();
          }}
          onClose={() => setPhone(null)}
        />
      ) : null}
    </>
  );
}
