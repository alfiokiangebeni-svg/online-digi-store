"use client";

import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Field } from "@/components/ui/Field";
import { PhoneField } from "@/components/ui/PhoneField";
import { Sheet } from "@/components/ui/Sheet";
import { Switch } from "@/components/ui/Switch";
import {
  IconBell,
  IconBriefcase,
  IconCalendar,
  IconCheck,
  IconHeart,
  IconTender,
  IconUpload,
} from "@/components/ui/icons";
import { activityStore, alertsStore, hasActivity, recordActivity, toggleAlert } from "@/lib/client/activity";
import { haptic } from "@/lib/client/haptics";
import { favoritesStore, toggleFavorite } from "@/lib/client/shop";
import { useStore } from "@/lib/client/store";
import { toast } from "@/lib/client/toast";
import type { Dictionary } from "@/lib/i18n";
import { format } from "@/lib/i18n/format";
import { parsePhone } from "@/lib/operators";
import { SuccessPanel } from "./SuccessPanel";

export type ListingTexts = Dictionary["listing"];
export type FieldTexts = Dictionary["field"];

interface Common {
  slug: string;
  title: string;
  t: ListingTexts;
  field: FieldTexts;
  closeLabel: string;
  activityHref: string;
}

function Phone({
  id,
  field,
  t,
  error,
  onChange,
}: {
  id: string;
  field: FieldTexts;
  t: ListingTexts;
  error?: string;
  onChange: (v: string) => void;
}) {
  return (
    <PhoneField
      id={id}
      label={t.phoneLabel}
      placeholder={field.phonePlaceholder}
      hint={field.phoneHint}
      detectedTemplate={field.operatorDetected}
      unknownText={field.operatorUnknown}
      onValueChange={onChange}
      error={error}
    />
  );
}

/** Les 5 prochains jours (calculés dans le navigateur seulement : jamais au rendu serveur). */
let cachedDays: { key: string; days: string[] } | null = null;
const noop = () => () => {};
function nextDays(): string[] {
  const key = new Date().toDateString();
  if (cachedDays?.key !== key) {
    const fmt = new Intl.DateTimeFormat(document.documentElement.lang || "fr", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    cachedDays = {
      key,
      days: Array.from({ length: 5 }, (_, i) => fmt.format(new Date(Date.now() + (i + 1) * 86_400_000))),
    };
  }
  return cachedDays.days;
}
const NO_DAYS: string[] = [];
function useNextDays() {
  return useSyncExternalStore(noop, nextDays, () => NO_DAYS);
}

/* ── Immobilier : réserver une visite ─────────────────────────────────────── */

export function VisitSheet({
  slug,
  title,
  t,
  field,
  closeLabel,
  activityHref,
  invalidPhone,
}: Common & { invalidPhone: string }) {
  const days = useNextDays();
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState(0);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string>();
  const [done, setDone] = useState<string>();

  return (
    <Sheet
      triggerLabel={t.visit}
      triggerVariant="primary"
      triggerIcon={<IconCalendar size={18} />}
      triggerClassName="flex-1"
      title={t.visitTitle}
      closeLabel={closeLabel}
    >
      {done ? (
        <SuccessPanel
          stamp={t.stamps.booked}
          title={t.visitTitle}
          body={done}
          href={activityHref}
          linkLabel={t.goActivities}
        />
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!parsePhone(phone)) return setError(invalidPhone);
            const text = format(t.visitDone, { day: days[day], slot: t.slots[slot] });
            recordActivity({
              kind: "visit",
              slug,
              title,
              status: "pending",
              detail: `${days[day]} · ${t.slots[slot]}`,
            });
            haptic();
            toast({ tone: "success", message: text });
            setDone(text);
          }}
        >
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-[13px] font-medium text-muted">{t.visitDay}</legend>
            <div className="scroll-rail -mx-1 flex gap-2 overflow-x-auto px-1">
              {days.map((d, i) => (
                <Chip key={d} selected={day === i} onClick={() => setDay(i)}>
                  {d}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-[13px] font-medium text-muted">{t.visitSlot}</legend>
            <div className="flex flex-wrap gap-2">
              {t.slots.map((s, i) => (
                <Chip key={s} selected={slot === i} onClick={() => setSlot(i)}>
                  {s}
                </Chip>
              ))}
            </div>
          </fieldset>
          <Phone
            id={`visit-${slug}`}
            field={field}
            t={t}
            error={error}
            onChange={(v) => {
              setPhone(v);
              setError(undefined);
            }}
          />
          <Button type="submit" block haptic>
            {t.visitConfirm}
          </Button>
        </form>
      )}
    </Sheet>
  );
}

/* ── Emploi : postuler / envoyer mon CV ────────────────────────────────────── */

export function ApplySheet({
  slug,
  title,
  publisher,
  mode,
  t,
  field,
  closeLabel,
  activityHref,
  invalidPhone,
}: Common & { publisher: string; mode: "application" | "cv"; invalidPhone: string }) {
  const list = useStore(activityStore);
  const already = hasActivity(list, mode, slug);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cv, setCv] = useState<string>();
  const [errors, setErrors] = useState<{ name?: string; phone?: string; cv?: string }>({});
  const [done, setDone] = useState(false);
  const isCv = mode === "cv";

  return (
    <Sheet
      triggerLabel={isCv ? t.sendCv : already ? t.alreadyApplied : t.apply}
      triggerVariant={isCv ? "outline" : "primary"}
      triggerIcon={
        isCv ? <IconUpload size={18} /> : already ? <IconCheck size={18} /> : <IconBriefcase size={18} />
      }
      triggerClassName="flex-1"
      title={isCv ? format(t.cvTitle, { publisher }) : `${t.applyTitle} · ${title}`}
      closeLabel={closeLabel}
    >
      {done ? (
        <SuccessPanel
          stamp={t.stamps.sent}
          title={isCv ? format(t.cvSent, { publisher }) : t.applied}
          body={t.trackHint}
          href={activityHref}
          linkLabel={t.goActivities}
        />
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const next = {
              name: name.trim() ? undefined : t.nameMissing,
              phone: parsePhone(phone) ? undefined : invalidPhone,
              cv: cv ? undefined : t.cvMissing,
            };
            setErrors(next);
            if (next.name || next.phone || next.cv) return;
            recordActivity({ kind: mode, slug, title, status: "sent", detail: cv });
            haptic();
            toast({ tone: "success", message: isCv ? format(t.cvSent, { publisher }) : t.applied });
            setDone(true);
          }}
        >
          <Field
            id={`name-${mode}-${slug}`}
            label={t.name}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <Phone id={`phone-${mode}-${slug}`} field={field} t={t} error={errors.phone} onChange={setPhone} />
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`cv-${mode}-${slug}`} className="text-[13px] font-medium text-muted">
              {t.cvLabel}
            </label>
            <input
              id={`cv-${mode}-${slug}`}
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              aria-invalid={errors.cv ? true : undefined}
              onChange={(e) => {
                setCv(e.target.files?.[0]?.name);
                setErrors((x) => ({ ...x, cv: undefined }));
              }}
              className="text-sm text-muted file:mr-3 file:min-h-11 file:rounded-[var(--radius-sm)] file:border file:border-line file:bg-surface-2 file:px-3 file:font-semibold file:text-fg"
            />
            <p className="text-xs text-muted" aria-live="polite">
              {cv ? format(t.cvChosen, { name: cv }) : t.cvHint}
            </p>
            {errors.cv ? <p className="text-xs font-medium text-urgent-text">{errors.cv}</p> : null}
          </div>
          {!isCv ? (
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`msg-${slug}`} className="text-[13px] font-medium text-muted">
                {t.message}
              </label>
              <textarea
                id={`msg-${slug}`}
                rows={3}
                className="rounded-[var(--radius-sm)] border border-line bg-surface-2 p-3 text-[15px] outline-none focus:border-primary"
              />
            </div>
          ) : null}
          <Button type="submit" block haptic>
            {isCv ? t.cvSend : t.applySend}
          </Button>
        </form>
      )}
    </Sheet>
  );
}

/* ── Sauvegarder (favoris) ─────────────────────────────────────────────────── */

export function SaveButton({
  slug,
  label,
  savedLabel,
  savedMsg,
  removedMsg,
}: {
  slug: string;
  label: string;
  savedLabel: string;
  savedMsg: string;
  removedMsg: string;
}) {
  const favorites = useStore(favoritesStore);
  const on = favorites.includes(slug);
  return (
    <Button
      variant="outline"
      aria-pressed={on}
      className="flex-1"
      icon={<IconHeart size={18} filled={on} className={on ? "text-urgent" : undefined} />}
      onClick={() => {
        toggleFavorite(slug);
        toast({ tone: on ? "info" : "success", message: on ? removedMsg : savedMsg });
      }}
    >
      {on ? savedLabel : label}
    </Button>
  );
}

/* ── Alerte nouvelle annonce ───────────────────────────────────────────────── */

export function AlertSwitch({
  category,
  label,
  on: onMsg,
  off: offMsg,
}: {
  category: string;
  label: string;
  on: string;
  off: string;
}) {
  const alerts = useStore(alertsStore);
  const id = `alert-${category}`;
  return (
    <div className="flex min-h-12 items-center gap-3">
      <IconBell size={18} className="shrink-0 text-muted" />
      <span id={id} className="flex-1 text-sm font-medium">
        {label}
      </span>
      <Switch
        checked={alerts.includes(category)}
        labelledBy={id}
        onChange={() => toast({ tone: "success", message: toggleAlert(category) ? onMsg : offMsg })}
      />
    </div>
  );
}

/* ── Appels d'offres : soumissionner ───────────────────────────────────────── */

export function SubmitSheet({
  slug,
  title,
  reference,
  documents,
  t,
  field,
  closeLabel,
  activityHref,
  invalidPhone,
}: Common & { reference: string; documents: string[]; invalidPhone: string }) {
  const list = useStore(activityStore);
  const already = hasActivity(list, "submission", slug);
  const [company, setCompany] = useState("");
  const [amount, setAmount] = useState("");
  const [delay, setDelay] = useState("");
  const [phone, setPhone] = useState("");
  const [docs, setDocs] = useState<boolean[]>(() => documents.map(() => false));
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [done, setDone] = useState(false);

  return (
    <Sheet
      triggerLabel={already ? t.alreadySubmitted : t.submit}
      triggerVariant="primary"
      triggerIcon={already ? <IconCheck size={18} /> : <IconTender size={18} />}
      triggerClassName="flex-1"
      title={`${t.submitTitle} · ${reference}`}
      closeLabel={closeLabel}
    >
      {done ? (
        <SuccessPanel
          stamp={t.stamps.submitted}
          title={t.submitted}
          body={format(t.submittedBody, { ref: reference })}
          href={activityHref}
          linkLabel={t.goActivities}
        />
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const n = Number(amount.replace(/[\s,]/g, ""));
            const next = {
              company: company.trim() ? undefined : t.companyMissing,
              amount: n > 0 ? undefined : t.amountInvalid,
              phone: parsePhone(phone) ? undefined : invalidPhone,
              docs: docs.every(Boolean) ? undefined : t.docsMissing,
            };
            setErrors(next);
            if (Object.values(next).some(Boolean)) return;
            recordActivity({
              kind: "submission",
              slug,
              title,
              status: "review",
              detail: `${reference} · ${n.toLocaleString("fr-CD")} $`,
            });
            haptic();
            toast({ tone: "success", message: t.submitted });
            setDone(true);
          }}
        >
          <Field
            id={`co-${slug}`}
            label={t.company}
            autoComplete="organization"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            error={errors.company}
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              id={`amt-${slug}`}
              label={t.amount}
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={errors.amount}
            />
            <Field
              id={`delay-${slug}`}
              label={t.delay}
              inputMode="numeric"
              value={delay}
              onChange={(e) => setDelay(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <fieldset className="flex flex-col gap-1">
            <legend className="mb-1 text-[13px] font-medium text-muted">{t.docsCheck}</legend>
            {documents.map((d, i) => (
              <label key={d} className="flex min-h-11 items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={docs[i]}
                  onChange={(e) => {
                    setDocs((x) => x.map((v, j) => (j === i ? e.target.checked : v)));
                    setErrors((x) => ({ ...x, docs: undefined }));
                  }}
                  className="size-5 accent-primary"
                />
                {d}
              </label>
            ))}
            {errors.docs ? <p className="text-xs font-medium text-urgent-text">{errors.docs}</p> : null}
          </fieldset>
          <Phone id={`sub-phone-${slug}`} field={field} t={t} error={errors.phone} onChange={setPhone} />
          <Button type="submit" block haptic>
            {t.submitSend}
          </Button>
        </form>
      )}
    </Sheet>
  );
}

/* ── Demander un devis (acheteur) ──────────────────────────────────────────── */

export function QuoteSheet({
  t,
  field,
  closeLabel,
  activityHref,
  invalidPhone,
  category,
}: Omit<Common, "slug" | "title"> & { invalidPhone: string; category: string }) {
  const [need, setNeed] = useState("");
  const [budget, setBudget] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [done, setDone] = useState(false);
  return (
    <Sheet
      triggerLabel={t.quote}
      triggerVariant="outline"
      triggerClassName="flex-1"
      title={t.quoteTitle}
      closeLabel={closeLabel}
    >
      {done ? (
        <SuccessPanel
          stamp={t.stamps.sent}
          title={t.quoteTitle}
          body={t.quoteDone}
          href={activityHref}
          linkLabel={t.goActivities}
        />
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const next = {
              need: need.trim() ? undefined : t.needMissing,
              phone: parsePhone(phone) ? undefined : invalidPhone,
            };
            setErrors(next);
            if (next.need || next.phone) return;
            recordActivity({
              kind: "quote",
              title: need.trim().slice(0, 80),
              status: "sent",
              detail: [category, budget && `${budget} $`].filter(Boolean).join(" · "),
            });
            toast({ tone: "success", message: t.quoteDone });
            setDone(true);
          }}
        >
          <p className="text-sm text-muted">{t.quoteIntro}</p>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="quote-need" className="text-[13px] font-medium text-muted">
              {t.need}
            </label>
            <textarea
              id="quote-need"
              rows={3}
              value={need}
              aria-invalid={errors.need ? true : undefined}
              onChange={(e) => setNeed(e.target.value)}
              className="rounded-[var(--radius-sm)] border border-line bg-surface-2 p-3 text-[15px] outline-none focus:border-primary"
            />
            {errors.need ? <p className="text-xs font-medium text-urgent-text">{errors.need}</p> : null}
          </div>
          <Field
            id="quote-budget"
            label={t.budgetField}
            inputMode="numeric"
            value={budget}
            onChange={(e) => setBudget(e.target.value.replace(/\D/g, ""))}
          />
          <Phone id="quote-phone" field={field} t={t} error={errors.phone} onChange={setPhone} />
          <Button type="submit" block>
            {t.quoteSend}
          </Button>
        </form>
      )}
    </Sheet>
  );
}
