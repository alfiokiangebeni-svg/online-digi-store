"use client";

import { useState } from "react";
import type { ProductSummary } from "@/lib/catalog";
import { favoritesStore, libraryStore, parentalStore } from "@/lib/client/shop";
import { useStore } from "@/lib/client/store";
import { setCurrency, setTheme, useCurrency, useTheme } from "@/lib/client/prefs";
import type { Locale } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/format";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { ListRow } from "@/components/ui/ListRow";
import { LiteToggle } from "@/components/ui/LiteToggle";
import { Price } from "@/components/ui/Price";
import { Segmented } from "@/components/ui/Segmented";
import { Switch } from "@/components/ui/Switch";
import { Thumb } from "@/components/ui/Thumb";
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
}: {
  products: Record<string, ProductSummary & { meta: string; href: string }>;
  locale: Locale;
  labels: AccountLabels;
}) {
  const library = useStore(libraryStore);
  const favorites = useStore(favoritesStore);
  const parental = useStore(parentalStore);
  const currency = useCurrency();
  const theme = useTheme();
  const [pin, setPin] = useState("");
  const [pinMsg, setPinMsg] = useState<{ ok: boolean; text: string }>();

  const paid = library.filter((i) => i.paidUsdCents > 0).length;
  const stats = [
    { label: t.stats.purchases, value: paid },
    { label: t.stats.free, value: library.length - paid },
    { label: t.stats.favorites, value: favorites.length },
  ];

  return (
    <div className="flex flex-col gap-8">
      <section className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="grid size-16 shrink-0 place-items-center bg-laterite-strong font-display text-2xl font-bold text-paper rounded-[var(--radius-control)]"
        >
          DS
        </span>
        <div>
          <h1 className="text-3xl font-bold">{t.guest}</h1>
          <p className="text-sm text-muted">{t.guestBody}</p>
        </div>
      </section>

      <dl className="grid grid-cols-3 border-y-2 border-line py-3 text-center">
        {stats.map((s, i) => (
          <div key={s.label} className={i ? "border-l-2 border-line" : undefined}>
            <dd className="font-mono text-2xl font-bold">{s.value}</dd>
            <dt className="text-xs text-muted">{s.label}</dt>
          </div>
        ))}
      </dl>

      {/* Contrôle parental */}
      <section aria-labelledby="parental-title" className="flex flex-col gap-4 bg-surface p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <IconLock size={20} className="mt-1 shrink-0" />
            <div>
              <h2 id="parental-title" className="text-xl font-bold">
                {t.parental}
              </h2>
              <p className="text-sm text-muted">
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
              <span id="age-label" className="text-sm font-medium">
                {t.maxAge}
              </span>
              <Segmented
                label={t.maxAge}
                value={String(parental.maxAge)}
                options={AGES.map((a) => ({ value: String(a), label: format(t.ageOption, { age: a }) }))}
                onChange={(v) => parentalStore.set({ ...parental, maxAge: Number(v) })}
              />
            </div>
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!/^\d{4}$/.test(pin)) {
                  setPinMsg({ ok: false, text: t.pinInvalid });
                  return;
                }
                parentalStore.set({ ...parental, pin });
                setPin("");
                setPinMsg({ ok: true, text: t.pinSaved });
              }}
            >
              <Field
                id="pin"
                label={t.pinLabel}
                className="flex-1"
                type="password"
                inputMode="numeric"
                maxLength={4}
                autoComplete="new-password"
                mono
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
                  setPinMsg(undefined);
                }}
                hint={pinMsg?.ok ? pinMsg.text : parental.pin ? undefined : t.pinNeeded}
                error={pinMsg && !pinMsg.ok ? pinMsg.text : undefined}
              />
              <Button
                type="submit"
                variant="secondary"
                className={pinMsg || !parental.pin ? "mb-7" : undefined}
              >
                {t.pinSave}
              </Button>
            </form>
          </>
        ) : null}
      </section>

      {/* Favoris */}
      <section aria-labelledby="fav-title">
        <h2 id="fav-title" className="text-xl font-bold">
          {t.favoritesTitle}
        </h2>
        {favorites.length ? (
          <ul className="mt-2">
            {favorites
              .map((slug) => products[slug])
              .filter(Boolean)
              .map((p) => (
                <ListRow
                  key={p.slug}
                  href={p.href}
                  media={
                    <Thumb
                      id={`f-${p.slug}`}
                      title={p.title}
                      tone={p.tone}
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
          <p className="mt-2 text-sm text-muted">{t.favoritesEmpty}</p>
        )}
      </section>

      {/* Réglages */}
      <section aria-labelledby="settings-title" className="flex flex-col gap-4">
        <h2 id="settings-title" className="text-xl font-bold">
          {t.settings}
        </h2>
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium">{t.currency}</span>
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
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium">{t.theme}</span>
          <Segmented
            label={t.theme}
            value={theme}
            options={[
              { value: "dark", label: t.themeDark },
              { value: "light", label: t.themeLight },
            ]}
            onChange={setTheme}
          />
        </div>
        <LiteToggle label={t.lite} hint={t.liteHint} onText={t.liteOn} offText={t.liteOff} />
      </section>
    </div>
  );
}
