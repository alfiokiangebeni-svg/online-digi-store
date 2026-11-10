"use client";

import { useState } from "react";
import type { ProductSummary } from "@/lib/catalog";
import { favoritesStore, libraryStore, parentalStore } from "@/lib/client/shop";
import { useStore } from "@/lib/client/store";
import { toast } from "@/lib/client/toast";
import { useFeedbackTexts } from "@/components/feedback/FeedbackProvider";
import { setCurrency, useCurrency } from "@/lib/client/prefs";
import { ThemePicker } from "@/components/ui/ThemePicker";
import type { Locale } from "@/lib/i18n/config";
import type { ThemeChoice } from "@/lib/theme";
import { format } from "@/lib/i18n/format";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { ListRow } from "@/components/ui/ListRow";
import { LiteToggle } from "@/components/ui/LiteToggle";
import { Price } from "@/components/ui/Price";
import { Segmented } from "@/components/ui/Segmented";
import { Switch } from "@/components/ui/Switch";
import { Thumb } from "@/components/ui/Thumb";
import { cn } from "@/components/ui/cn";
import { IconLock } from "@/components/ui/icons";

const AGES = [3, 6, 9, 12];

export interface AccountLabels {
  guest: string;
  guestBody: string;
  stats: { purchases: string; free: string; favorites: string };
  parental: string;
  parentalOn: string;
  parentalOff: string;
  maxAge: string;
  ageOption: string;
  pinLabel: string;
  pinSave: string;
  pinSaved: string;
  pinInvalid: string;
  pinNeeded: string;
  settings: string;
  currency: string;
  theme: string;
  themeDark: string;
  themeLight: string;
  themeAuto: string;
  themeNames: Record<ThemeChoice, string>;
  themeHint: string;
  themeSaved: string;
  lite: string;
  liteHint: string;
  liteOn: string;
  liteOff: string;
  favoritesTitle: string;
  favoritesEmpty: string;
  free: string;
  oldPrice: string;
}

export function AccountView({
  products,
  locale,
  labels: t,
  purchases,
}: {
  products: Record<string, ProductSummary & { meta: string; href: string }>;
  locale: Locale;
  labels: AccountLabels;
  /** Entrée « Mes achats », affichée sous les compteurs. */
  purchases?: React.ReactNode;
}) {
  const library = useStore(libraryStore);
  const favorites = useStore(favoritesStore);
  const parental = useStore(parentalStore);
  const fb = useFeedbackTexts();
  const currency = useCurrency();
  const [pin, setPin] = useState("");
  const [pinMsg, setPinMsg] = useState<{ ok: boolean; text: string }>();

  const paid = library.filter((i) => i.paidUsdCents > 0).length;
  const stats = [
    { label: t.stats.purchases, value: paid },
    { label: t.stats.free, value: library.length - paid },
    { label: t.stats.favorites, value: favorites.length },
  ];

  return (
    <div className="flex flex-col gap-3">
      <section className="flex items-center gap-3 pb-1 pt-2">
        <span
          aria-hidden="true"
          className="grid size-[52px] shrink-0 place-items-center rounded-full bg-night text-lg font-semibold text-champagne ring-2 ring-champagne/60"
        >
          DS
        </span>
        <div>
          <h1 className="text-lg font-bold">{t.guest}</h1>
          <p className="text-[13px] leading-snug text-muted">{t.guestBody}</p>
        </div>
      </section>

      <dl className="card grid grid-cols-3 text-center">
        {stats.map((s, i) => (
          <div key={s.label} className={cn("py-3", i === 1 && "border-x border-surface-2")}>
            <dd className="text-[17px] font-bold">{s.value}</dd>
            <dt className="text-xs text-muted">{s.label}</dt>
          </div>
        ))}
      </dl>

      {purchases}

      {/* Contrôle parental */}
      <section aria-labelledby="parental-title" className="card flex flex-col gap-3 p-3.5">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-start gap-2.5">
            <IconLock size={18} className="mt-0.5 shrink-0" />
            <div>
              <h2 id="parental-title" className="text-[15px] font-semibold">
                {t.parental}
              </h2>
              <p className="text-xs text-muted">
                {parental.enabled ? format(t.parentalOn, { age: parental.maxAge }) : t.parentalOff}
              </p>
            </div>
          </div>
          <Switch
            checked={parental.enabled}
            labelledBy="parental-title"
            onChange={(enabled) => parentalStore.set({ ...parental, enabled })}
          />
        </div>
        {parental.enabled ? (
          <>
            <div className="flex flex-col gap-2">
              <span id="age-label" className="text-[13px] text-muted">
                {t.maxAge}
              </span>
              <div role="group" aria-labelledby="age-label" className="flex gap-2">
                {AGES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={parental.maxAge === a}
                    onClick={() => parentalStore.set({ ...parental, maxAge: a })}
                    className={cn(
                      "h-10 flex-1 rounded-[6px] bg-surface text-[13px]",
                      parental.maxAge === a ? "border-2 border-primary font-semibold" : "border border-line",
                    )}
                  >
                    {format(t.ageOption, { age: a })}
                  </button>
                ))}
              </div>
            </div>
            <form
              className="flex items-start gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!/^\d{4}$/.test(pin)) {
                  setPinMsg({ ok: false, text: t.pinInvalid });
                  return;
                }
                parentalStore.set({ ...parental, pin });
                setPin("");
                setPinMsg({ ok: true, text: t.pinSaved });
                toast({ tone: "success", message: fb.pinSaved });
              }}
            >
              <Field
                id="pin"
                label={t.pinLabel}
                className="min-w-0 flex-1"
                type="password"
                inputMode="numeric"
                maxLength={4}
                autoComplete="new-password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
                  setPinMsg(undefined);
                }}
                hint={pinMsg?.ok ? pinMsg.text : parental.pin ? undefined : t.pinNeeded}
                error={pinMsg && !pinMsg.ok ? pinMsg.text : undefined}
              />
              <Button type="submit" variant="secondary" className="mt-[26px] shrink-0 px-3">
                {t.pinSave}
              </Button>
            </form>
          </>
        ) : null}
      </section>

      {/* Favoris */}
      <section aria-labelledby="fav-title" className="card pt-3">
        <h2 id="fav-title" className="px-3.5 text-[15px] font-semibold">
          {t.favoritesTitle}
        </h2>
        {favorites.length ? (
          <ul className="mt-1">
            {favorites
              .map((slug) => products[slug])
              .filter(Boolean)
              .map((p) => (
                <ListRow
                  key={p.slug}
                  href={p.href}
                  media={
                    <Thumb
                      title={p.title}
                      tone={p.tone}
                      size={44}
                      round={p.kind === "game" || p.kind === "edu"}
                    />
                  }
                  title={p.title}
                  meta={p.meta}
                  action={
                    <Price
                      usdCents={p.priceUsdCents}
                      promoUsdCents={p.promoUsdCents}
                      locale={locale}
                      oldPriceLabel={t.oldPrice}
                      freeLabel={t.free}
                    />
                  }
                />
              ))}
          </ul>
        ) : (
          <p className="px-3.5 pb-3.5 pt-1 text-xs text-muted">{t.favoritesEmpty}</p>
        )}
      </section>

      {/* Réglages */}
      <section aria-labelledby="settings-title" className="card flex flex-col gap-3 p-3.5">
        <h2 id="settings-title" className="text-[15px] font-semibold">
          {t.settings}
        </h2>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span>{t.currency}</span>
          <Segmented
            label={t.currency}
            value={currency}
            options={[
              { value: "USD", label: "USD $" },
              { value: "CDF", label: "CDF FC" },
            ]}
            onChange={setCurrency}
          />
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span>{t.theme}</span>
          <ThemePicker label={t.theme} names={t.themeNames} hint={t.themeHint} saved={t.themeSaved} />
        </div>
        <LiteToggle label={t.lite} hint={t.liteHint} onText={t.liteOn} offText={t.liteOff} />
      </section>
    </div>
  );
}
