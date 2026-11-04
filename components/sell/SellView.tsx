"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { MobileMoneyPay } from "@/components/shop/MobileMoneyPay";
import type { PaymentLabels } from "@/components/shop/PaymentFlow";
import { SuccessPanel } from "@/components/listings/SuccessPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { Chip } from "@/components/ui/Chip";
import { Field } from "@/components/ui/Field";
import { PhoneField } from "@/components/ui/PhoneField";
import { Segmented } from "@/components/ui/Segmented";
import { Sheet } from "@/components/ui/Sheet";
import { Switch } from "@/components/ui/Switch";
import { TicketCover } from "@/components/ui/Ticket";
import { IconBolt, IconMessage, IconTrash } from "@/components/ui/icons";
import { haptic } from "@/lib/client/haptics";
import {
  draftsStore,
  myListingsStore,
  repliesStore,
  statsOf,
  type MyListing,
  type Values,
} from "@/lib/client/sell";
import { useStore } from "@/lib/client/store";
import { toast } from "@/lib/client/toast";
import { setSearchParams, useSearchParam } from "@/lib/client/url";
import type { Dictionary } from "@/lib/i18n";
import { format } from "@/lib/i18n/format";
import { parsePhone } from "@/lib/operators";
import { CATEGORY_IDS, type CategoryId } from "@/lib/theme";
import { FIELDS, PRICE_FIELD } from "./fields";

type Tab = "publish" | "mine" | "inbox";
const TABS: Tab[] = ["publish", "mine", "inbox"];

/** Heure courante rafraîchie toutes les 30 s (statistiques simulées) ; 0 au rendu serveur. */
const clock = {
  subscribe(cb: () => void) {
    const t = setInterval(cb, 30_000);
    return () => clearInterval(t);
  },
  snapshot: () => Math.floor(Date.now() / 30_000) * 30_000,
};
const useNow = () => useSyncExternalStore(clock.subscribe, clock.snapshot, () => 0);

const docLang = () => (typeof document === "undefined" ? "fr" : document.documentElement.lang || "fr");

export interface SellTexts {
  s: Dictionary["sellx"];
  categories: Dictionary["categories"];
  formats: Dictionary["px"]["formats"];
  field: Dictionary["field"];
  invalidPhone: string;
  close: string;
  undo: string;
  payment: PaymentLabels;
  boostPriceText: string;
  boostPrice: ReactNode;
}

/** Onglet Vendre : publier (formulaire par catégorie), mes annonces, messages reçus. */
export function SellView({ texts: x, locale }: { texts: SellTexts; locale: string }) {
  const s = x.s;
  const tabParam = useSearchParam("onglet") as Tab;
  const tab: Tab = TABS.includes(tabParam) ? tabParam : "publish";
  const mine = useStore(myListingsStore);

  return (
    <div className="flex flex-col gap-3">
      <Segmented
        label={s.tabsLabel}
        value={tab}
        className="self-start"
        options={TABS.map((t) => ({
          value: t,
          label: t === "mine" && mine.length ? `${s.tabs[t]} (${mine.length})` : s.tabs[t],
        }))}
        onChange={(t) => setSearchParams({ onglet: t === "publish" ? null : t })}
      />
      {tab === "publish" ? <PublishForm x={x} /> : null}
      {tab === "mine" ? <MyListings x={x} locale={locale} /> : null}
      {tab === "inbox" ? <Inbox x={x} /> : null}
    </div>
  );
}

/* ── Publier ─────────────────────────────────────────────────────────────── */

function removeDraft(category: CategoryId) {
  draftsStore.set((d) => {
    const next = { ...d };
    delete next[category];
    return next;
  });
}

function PublishForm({ x }: { x: SellTexts }) {
  const s = x.s;
  const param = useSearchParam("categorie") as CategoryId;
  const [picked, setPicked] = useState<CategoryId | null>(null);
  const category = picked ?? (CATEGORY_IDS.includes(param) ? param : null);
  const drafts = useStore(draftsStore);
  const [values, setValues] = useState<Values>({});
  const [restoredFrom, setRestoredFrom] = useState<number>();
  const [checkedDraftFor, setCheckedDraftFor] = useState<CategoryId | null>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [step, setStep] = useState<"form" | "preview" | "done">("form");
  const [files, setFiles] = useState(0);
  const [formKey, setFormKey] = useState(0);

  // Brouillon repris automatiquement à l'ouverture d'une catégorie (une seule fois).
  if (category && checkedDraftFor !== category) {
    setCheckedDraftFor(category);
    const draft = drafts[category];
    setValues(draft?.values ?? {});
    setRestoredFrom(draft?.at);
    setErrors({});
    setStep("form");
    setFormKey((k) => k + 1);
  }

  function pick(c: CategoryId | null) {
    setPicked(c);
    setCheckedDraftFor(null);
    setSearchParams({ categorie: c });
  }

  if (!category) {
    return (
      <section aria-labelledby="step1" className="flex flex-col gap-2">
        <h2 id="step1" className="px-1 text-[17px] font-bold">
          {s.step1}
        </h2>
        <ul className="grid grid-cols-2 gap-2">
          {CATEGORY_IDS.map((id) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => pick(id)}
                className="card pressable flex min-h-[5.5rem] w-full flex-col justify-between gap-2 p-3 text-left hover:bg-surface-2"
              >
                <span className="grid size-10 place-items-center rounded-full bg-surface-2">
                  <CategoryIcon id={id} size={20} />
                </span>
                <span className="flex items-center justify-between gap-2 text-sm font-semibold">
                  {x.categories[id]}
                  {drafts[id] ? <Badge tone="neutral">{s.draftBadge}</Badge> : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  const priceField = PRICE_FIELD[category];
  const set = (name: string, v: string) => {
    setValues((o) => ({ ...o, [name]: v }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };
  const amount = Number((values[priceField] ?? "").replace(/[\s,]/g, ""));

  function validate() {
    const next = {
      title: (values.title ?? "").trim().length >= 5 ? undefined : s.errors.title,
      description: (values.description ?? "").trim().length >= 20 ? undefined : s.errors.description,
      [priceField]: amount > 0 ? undefined : s.errors.price,
      phone: parsePhone(values.phone ?? "") ? undefined : x.invalidPhone,
    };
    setErrors(next);
    const ok = !Object.values(next).some(Boolean);
    if (!ok) toast({ tone: "error", message: s.errors.fix });
    return ok;
  }

  if (step === "done") {
    return (
      <div className="card p-4">
        <SuccessPanel
          stamp={s.stampPublished}
          title={s.published}
          body={s.publishedBody}
          href="?onglet=mine"
          linkLabel={s.seeMine}
          onLink={() => {
            setPicked(null);
            setCheckedDraftFor(null);
            setSearchParams({ onglet: "mine", categorie: null });
          }}
        />
        <Button variant="ghost" block className="mt-2" onClick={() => pick(null)}>
          {s.newListing}
        </Button>
      </div>
    );
  }

  if (step === "preview") {
    const meta = [values.commune, values.sector, values.genre, values.version].filter(Boolean).join(" · ");
    return (
      <section aria-labelledby="preview-title" className="flex flex-col gap-3">
        <h2 id="preview-title" className="px-1 text-[17px] font-bold">
          {s.previewTitle}
        </h2>
        <p className="px-1 text-xs text-muted">{s.previewNote}</p>
        <article className="card overflow-hidden">
          <TicketCover title={values.title ?? ""} category={category} />
          <div className="flex flex-col gap-1.5 p-3.5">
            <Badge tone="neutral" className="self-start" icon={<CategoryIcon id={category} size={12} />}>
              {x.categories[category]}
            </Badge>
            <p className="price-tag text-[22px]">{amount.toLocaleString("fr-CD")} $</p>
            <h3 className="text-base font-semibold">{values.title}</h3>
            {meta ? <p className="text-xs text-muted">{meta}</p> : null}
            <p className="text-sm leading-relaxed">{values.description}</p>
          </div>
        </article>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => setStep("form")}>
            {s.edit}
          </Button>
          <Button
            className="flex-1"
            haptic
            onClick={() => {
              myListingsStore.set((l) => [{ id: `l-${Date.now()}`, category, values, at: Date.now() }, ...l]);
              removeDraft(category);
              toast({ tone: "success", message: s.published });
              setStep("done");
            }}
          >
            {s.publish}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <form
      key={formKey}
      className="flex flex-col gap-4"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (validate()) setStep("preview");
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 px-1 text-[17px] font-bold">
          <CategoryIcon id={category} size={20} className="text-muted" />
          {s.step2}
        </h2>
        <Button type="button" variant="ghost" size="sm" onClick={() => pick(null)}>
          {s.change}
        </Button>
      </div>
      {restoredFrom ? (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-sm)] bg-surface-2 px-3 py-1 text-sm"
        >
          <span>
            {format(s.draftRestored, {
              date: new Date(restoredFrom).toLocaleDateString(docLang(), { day: "numeric", month: "short" }),
            })}
          </span>
          <button
            type="button"
            className="min-h-11 text-xs font-semibold underline underline-offset-2"
            onClick={() => {
              removeDraft(category);
              setValues({});
              setRestoredFrom(undefined);
              setFormKey((k) => k + 1);
              toast({ tone: "info", message: s.draftCleared });
            }}
          >
            {s.draftClear}
          </button>
        </div>
      ) : null}

      <Field
        id="sell-title"
        label={s.fields.title}
        value={values.title ?? ""}
        onChange={(e) => set("title", e.target.value)}
        error={errors.title}
      />
      <TextArea
        id="sell-description"
        label={s.fields.description}
        value={values.description ?? ""}
        onChange={(v) => set("description", v)}
        error={errors.description}
      />

      {FIELDS[category].map((f) => {
        const label = s.fields[f.name as keyof typeof s.fields];
        const id = `sell-${f.name}`;
        if (f.kind === "textarea")
          return (
            <TextArea
              key={f.name}
              id={id}
              label={label}
              value={values[f.name] ?? ""}
              onChange={(v) => set(f.name, v)}
            />
          );
        if (f.kind === "switch")
          return (
            <div key={f.name} className="flex min-h-12 items-center justify-between gap-3">
              <span id={id} className="text-sm font-medium">
                {label}
              </span>
              <Switch
                checked={values[f.name] === "1"}
                labelledBy={id}
                onChange={(on) => set(f.name, on ? "1" : "")}
              />
            </div>
          );
        if (f.kind === "select" || f.kind === "chips") {
          const names = (
            f.kind === "chips" ? x.formats : s.options[f.name as "contract" | "mode" | "type" | "license"]
          ) as Record<string, string>;
          const chosen = (values[f.name] ?? "").split(",").filter(Boolean);
          return (
            <div key={f.name} role="group" aria-label={label} className="flex flex-col gap-2">
              <span className="text-[13px] font-medium text-muted">{label}</span>
              <div className="flex flex-wrap gap-2">
                {f.options!.map((o) => {
                  const on =
                    f.kind === "chips" ? chosen.includes(o) : (values[f.name] ?? f.options![0]) === o;
                  return (
                    <Chip
                      key={o}
                      selected={on}
                      onClick={() =>
                        set(
                          f.name,
                          f.kind === "chips"
                            ? (on ? chosen.filter((c) => c !== o) : [...chosen, o]).join(",")
                            : o,
                        )
                      }
                    >
                      {names[o]}
                    </Chip>
                  );
                })}
              </div>
            </div>
          );
        }
        return (
          <Field
            key={f.name}
            id={id}
            label={label}
            inputMode={f.kind === "number" ? "numeric" : undefined}
            value={values[f.name] ?? ""}
            onChange={(e) =>
              set(f.name, f.kind === "number" ? e.target.value.replace(/[^\d]/g, "") : e.target.value)
            }
            error={errors[f.name]}
          />
        );
      })}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="sell-files" className="text-[13px] font-medium text-muted">
          {s.fields.photos}
        </label>
        <input
          id="sell-files"
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.epub,.mp3,.apk,.zip"
          onChange={(e) => setFiles(e.target.files?.length ?? 0)}
          className="text-sm text-muted file:mr-3 file:min-h-11 file:rounded-[var(--radius-sm)] file:border file:border-line file:bg-surface-2 file:px-3 file:font-semibold file:text-fg"
        />
        <p className="text-xs text-muted">
          {files ? format(s.fields.photosChosen, { count: files }) : s.fields.photosHint}
        </p>
      </div>

      <PhoneField
        id="sell-phone"
        label={s.fields.phone}
        placeholder={x.field.phonePlaceholder}
        hint={x.field.phoneHint}
        detectedTemplate={x.field.operatorDetected}
        unknownText={x.field.operatorUnknown}
        onValueChange={(v) => set("phone", v)}
        error={errors.phone}
      />

      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          block
          onClick={() => {
            draftsStore.set((d) => ({ ...d, [category]: { values, at: Date.now() } }));
            toast({ tone: "success", message: s.draftSaved });
          }}
        >
          {s.saveDraft}
        </Button>
        <Button type="submit" block>
          {s.preview}
        </Button>
      </div>
    </form>
  );
}

function TextArea({
  id,
  label,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-muted">
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        value={value}
        aria-invalid={error ? true : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-[var(--radius-sm)] border border-line bg-surface-2 p-3 text-[15px] outline-none focus:border-primary aria-[invalid=true]:border-urgent"
      />
      {error ? <p className="text-xs font-medium text-urgent-text">{error}</p> : null}
    </div>
  );
}

/* ── Mes annonces : statistiques, booster, supprimer ─────────────────────── */

function MyListings({ x, locale }: { x: SellTexts; locale: string }) {
  const s = x.s;
  const list = useStore(myListingsStore);
  const now = useNow();
  if (!list.length) return <p className="card p-4 text-sm text-muted">{s.mineEmpty}</p>;
  const nf = (n: number) => n.toLocaleString(locale === "en" ? "en-US" : "fr-CD");
  return (
    <ul className="flex flex-col gap-3">
      {list.map((l, index) => {
        const st = statsOf(l, now || l.at);
        const third =
          l.category === "jobs"
            ? { label: s.stats.applications, value: st.responses }
            : l.category === "tenders"
              ? { label: s.stats.bids, value: st.responses }
              : l.category === "realestate"
                ? { label: s.stats.visits, value: st.responses }
                : { label: s.stats.sales, value: st.sales };
        return (
          <li key={l.id} className="card flex flex-col gap-3 p-3.5">
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-surface-2">
                <CategoryIcon id={l.category} size={20} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="truncate text-sm font-semibold">{l.values.title}</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge tone={st.live ? "success" : "neutral"}>
                    {st.live ? s.status.live : s.status.review}
                  </Badge>
                  {l.boosted ? (
                    <Badge tone="neutral" icon={<IconBolt size={12} />}>
                      {s.boosted}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
            <dl className="grid grid-cols-3 border-y border-line py-2 text-center">
              {[
                { label: s.stats.views, value: st.views },
                { label: s.stats.contacts, value: st.contacts },
                third,
              ].map((k, i) => (
                <div key={k.label} className={i ? "border-l border-line" : undefined}>
                  <dd className="text-[17px] font-bold tabular-nums">{nf(k.value)}</dd>
                  <dt className="text-[11px] text-muted">{k.label}</dt>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-2">
              {
                <MobileMoneyPay
                  hideTrigger={l.boosted}
                  id={`boost-${l.id}`}
                  amount={x.boostPrice}
                  payment={x.payment}
                  doneHref="?onglet=mine"
                  variant="primary"
                  icon={<IconBolt size={18} />}
                  className="flex-1"
                  onPaid={() =>
                    myListingsStore.set((all) =>
                      all.map((a) => (a.id === l.id ? { ...a, boosted: true } : a)),
                    )
                  }
                  texts={{
                    trigger: s.boost,
                    title: s.boostTitle,
                    intro: format(s.boostIntro, { price: x.boostPriceText }),
                    pay: format(s.boostPay, { price: x.boostPriceText }),
                    successTitle: s.boostSuccess,
                    successBody: s.boostBody,
                    doneLabel: s.seeMine,
                    phoneLabel: x.field.phoneLabel,
                    phonePlaceholder: x.field.phonePlaceholder,
                    phoneHint: x.field.phoneHint,
                    detected: x.field.operatorDetected,
                    unknown: x.field.operatorUnknown,
                    invalid: x.invalidPhone,
                    close: x.close,
                  }}
                />
              }
              <Button
                variant="outline"
                icon={<IconTrash size={18} />}
                onClick={() => {
                  myListingsStore.set((all) => all.filter((a) => a.id !== l.id));
                  toast({
                    tone: "info",
                    message: s.removed,
                    action: {
                      label: x.undo,
                      onClick: () =>
                        myListingsStore.set((all) => [...all.slice(0, index), l, ...all.slice(index)]),
                    },
                  });
                }}
              >
                {s.remove}
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ── Messages, candidatures et offres reçus ──────────────────────────────── */

function Inbox({ x }: { x: SellTexts }) {
  const s = x.s;
  const mine = useStore(myListingsStore);
  const replies = useStore(repliesStore);
  const generated = mine.map((l: MyListing, i) => {
    const name = s.names[i % s.names.length];
    const kind = l.category === "jobs" ? "application" : l.category === "tenders" ? "bid" : "message";
    const amount = Math.round(Number(l.values[PRICE_FIELD.tenders] || 1000) * 0.92).toLocaleString("fr-CD");
    const text = format(
      kind === "application" ? s.genApplication : kind === "bid" ? s.genBid : s.genMessage,
      {
        name,
        title: l.values.title ?? "",
        amount,
      },
    );
    return { id: `g-${l.id}`, from: name, kind, text };
  });
  const items = [...generated, ...s.demoInbox];
  return (
    <section className="flex flex-col gap-2">
      <p className="px-1 text-xs text-muted">{s.inboxIntro}</p>
      <ul className="card overflow-hidden">
        {items.map((m) => (
          <li key={m.id} className="flex flex-col gap-2 border-b border-line p-3.5 last:border-b-0">
            <p className="flex items-center gap-2 text-xs text-muted">
              <Badge tone="neutral">{s.kinds[m.kind as keyof typeof s.kinds]}</Badge>
              <span className="font-semibold text-fg">{m.from}</span>
            </p>
            <p className="text-sm">{m.text}</p>
            {replies[m.id] ? (
              <p className="rounded-[var(--radius-sm)] border-l-4 border-primary bg-surface-2 px-3 py-2 text-sm">
                <span className="block text-xs font-semibold text-muted">{s.replied}</span>
                {replies[m.id]}
              </p>
            ) : (
              <ReplySheet id={m.id} name={m.from} x={x} />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ReplySheet({ id, name, x }: { id: string; name: string; x: SellTexts }) {
  const s = x.s;
  const [text, setText] = useState("");
  const [error, setError] = useState<string>();
  return (
    <Sheet
      triggerLabel={s.reply}
      triggerVariant="outline"
      triggerIcon={<IconMessage size={18} />}
      triggerClassName="self-start"
      title={format(s.replyTitle, { name })}
      closeLabel={x.close}
    >
      {(close) => (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return setError(s.replyMissing);
            repliesStore.set((r) => ({ ...r, [id]: text.trim() }));
            haptic();
            toast({ tone: "success", message: s.replySent });
            close();
          }}
        >
          <TextArea
            id={`reply-${id}`}
            label={s.replyLabel}
            value={text}
            onChange={(v) => {
              setText(v);
              setError(undefined);
            }}
            error={error}
          />
          <Button type="submit" block>
            {s.replySend}
          </Button>
        </form>
      )}
    </Sheet>
  );
}
