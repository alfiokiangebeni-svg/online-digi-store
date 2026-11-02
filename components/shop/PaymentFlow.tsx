"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { mockOutcome, PAYMENT_TIMEOUT_SECONDS, type PaymentOutcome } from "@/lib/payments/mock";
import type { ParsedPhone } from "@/lib/operators";
import { format } from "@/lib/i18n/format";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Countdown } from "@/components/ui/Countdown";
import { Field } from "@/components/ui/Field";
import { Stamp } from "@/components/ui/Stamp";
import { IconClose, IconPhone } from "@/components/ui/icons";

export type FlowStep = "pin" | "sending" | "waiting" | "success" | "failed";

export interface PaymentLabels {
  title: string;
  sending: string;
  waiting: string;
  waitingBody: string;
  expires: string;
  success: string;
  successBody: string;
  giftSent: string;
  goLibrary: string;
  failed: Record<Exclude<PaymentOutcome, "success">, string>;
  retry: string;
  cancel: string;
  close: string;
  pinTitle: string;
  pinBody: string;
  pinLabel: string;
  pinWrong: string;
  pinConfirm: string;
  delivered: string;
  flashEnded: string;
}

/**
 * Parcours de paiement Mobile Money (adaptateur mock) :
 * code parental éventuel → demande envoyée → attente du PIN → livré ou échec.
 * Phase 4 : mêmes écrans, branchés sur PaymentProvider + webhook.
 */
export function PaymentFlow({
  phone,
  pin,
  total,
  count,
  gifts,
  libraryHref,
  labels: t,
  onSuccess,
  onClose,
}: {
  phone: ParsedPhone | null;
  /** Code parental à demander avant l'envoi (null : pas de contrôle). */
  pin: string | null;
  total: React.ReactNode;
  count: number;
  gifts: string[];
  libraryHref: string;
  labels: PaymentLabels;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const paid = useRef(false);
  const [step, setStep] = useState<FlowStep>(pin ? "pin" : "sending");
  const [outcome, setOutcome] = useState<PaymentOutcome>("success");
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState<string>();
  // Récapitulatif figé à l'ouverture : le panier se vide au moment du succès.
  const [summary] = useState(() => ({ total, count, gifts }));

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  /** Programme les étapes simulées par l'adaptateur mock. */
  function schedule() {
    if (!phone) return;
    clear();
    const result = mockOutcome(phone.e164);
    timers.current.push(
      setTimeout(() => setStep("waiting"), 1200),
      setTimeout(
        () => {
          setOutcome(result);
          if (result === "success") {
            setStep("success");
            // Une commande n'est validée qu'une fois (idempotence, comme le webhook en phase 4).
            if (!paid.current) {
              paid.current = true;
              onSuccess();
            }
          } else setStep("failed");
        },
        result === "timeout" ? 7000 : 4200,
      ),
    );
  }

  function run() {
    setStep("sending");
    schedule();
  }

  // Le composant est monté à l'ouverture : on ouvre le <dialog> natif et on lance l'envoi.
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    if (!pin) schedule();
    // Next garde les pages quittées en mémoire (masquées) : on ferme le dialogue
    // modal pour qu'il ne bloque pas la page suivante.
    return () => {
      clear();
      if (dialog?.open) dialog.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- une seule fois, au montage
  }, []);

  const operator = phone?.operator.name ?? "";
  const busy = step === "sending" || step === "waiting";

  return (
    <dialog
      ref={ref}
      aria-labelledby="pay-title"
      onClose={() => {
        clear();
        onClose();
      }}
      onCancel={(e) => busy && e.preventDefault()}
      className="m-0 mt-auto w-full max-w-none rounded-t-2xl bg-surface p-0 text-fg backdrop:bg-ink/60 sm:m-auto sm:max-w-md sm:rounded-2xl"
    >
      <div className="flex min-h-80 flex-col gap-4 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <div className="flex items-start justify-between gap-4">
          <h2 id="pay-title" className="text-lg font-bold">
            {t.title}
          </h2>
          {!busy ? (
            <button
              type="button"
              aria-label={t.close}
              onClick={() => ref.current?.close()}
              className="-m-2 grid size-11 shrink-0 place-items-center rounded-full hover:bg-surface-2"
            >
              <IconClose size={20} />
            </button>
          ) : null}
        </div>

        <div role="status" aria-live="polite" className="flex flex-1 flex-col gap-4">
          {step === "pin" ? (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (pinValue === pin) run();
                else setPinError(t.pinWrong);
              }}
            >
              <p className="font-medium">{t.pinTitle}</p>
              <p className="text-muted">{t.pinBody}</p>
              <Field
                id="parental-pin"
                label={t.pinLabel}
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                autoComplete="off"
                mono
                value={pinValue}
                onChange={(e) => setPinValue(e.target.value.replace(/\D/g, "").slice(0, 4))}
                error={pinError}
              />
              <Button type="submit" block>
                {t.pinConfirm}
              </Button>
            </form>
          ) : null}

          {step === "sending" ? <p className="text-lg">{format(t.sending, { operator })}</p> : null}

          {step === "waiting" ? (
            <>
              <div className="flex items-center gap-3">
                <span className="grid size-12 shrink-0 animate-beat place-items-center rounded-full bg-lime text-leaf-strong">
                  <IconPhone />
                </span>
                <div>
                  <p className="text-xl font-bold">{t.waiting}</p>
                  <p className="text-muted">{format(t.waitingBody, { operator })}</p>
                </div>
              </div>
              <p className="text-2xl font-bold">{summary.total}</p>
              <Countdown
                durationMs={PAYMENT_TIMEOUT_SECONDS * 1000}
                label={t.expires}
                endedLabel={t.flashEnded}
              />
            </>
          ) : null}

          {step === "success" ? (
            <>
              <div className="grid place-items-center rounded-[10px] bg-mint py-8 dark:bg-surface-2">
                <Stamp label={t.delivered} announce={false} />
              </div>
              <p className="text-xl font-bold">{t.success}</p>
              <p className="text-muted">{format(t.successBody, { count: summary.count })}</p>
              {summary.gifts.map((g) => (
                <p key={g} className="text-sm">
                  {format(t.giftSent, { phone: g })}
                </p>
              ))}
              <Link href={libraryHref} className={buttonClasses({ variant: "secondary", block: true })}>
                {t.goLibrary}
              </Link>
            </>
          ) : null}

          {step === "failed" && outcome !== "success" ? (
            <>
              <p className="rounded-[8px] bg-[#fdecea] px-3 py-3 font-medium text-[#b42318] dark:bg-surface-2 dark:text-[#ff8a80]">
                {format(t.failed[outcome], { operator })}
              </p>
              <div className="flex gap-2">
                <Button onClick={run} className="flex-1">
                  {t.retry}
                </Button>
                <Button variant="secondary" onClick={() => ref.current?.close()} className="flex-1">
                  {t.cancel}
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
