import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { IconChat, IconChevron, Money } from "@/components/ui";
import { SellView } from "@/components/sell/SellView";
import { BOOST_USD_CENTS } from "@/components/sell/fields";
import { formatMoney } from "@/lib/currency";
import { SUPPORT_WHATSAPP } from "@/lib/brand";
import { getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";

export async function generateMetadata({ params }: PageProps<"/[locale]/vendre">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLocale(params));
  return { title: dict.sell.title };
}

/**
 * Onglet « Vendre » : formulaire de publication par catégorie (brouillon, aperçu),
 * mes annonces (statistiques, mise en avant payante) et messages reçus.
 */
export default async function SellPage({ params }: PageProps<"/[locale]/vendre">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const t = dict.sell;

  return (
    <AppShell locale={locale} dict={dict} tab="sell" path="vendre" search={false}>
      <h1 className="mt-1 text-[22px] font-bold">{t.title}</h1>
      <p className="mt-1 text-sm text-muted">{t.intro}</p>

      <div className="mt-4">
        <SellView
          locale={locale}
          texts={{
            s: dict.sellx,
            categories: dict.categories,
            formats: dict.px.formats,
            field: dict.field,
            invalidPhone: dict.cart.phoneInvalid,
            close: dict.sheet.close,
            undo: dict.feedback.undo,
            payment: {
              ...dict.payment,
              delivered: dict.listing.stamps.paid,
              flashEnded: dict.commerce.flashEnded,
            },
            boostPriceText: formatMoney(BOOST_USD_CENTS, "USD", locale),
            boostPrice: <Money usdCents={BOOST_USD_CENTS} locale={locale} />,
          }}
        />
      </div>

      <section aria-labelledby="steps-title" className="card mt-4 p-4">
        <h2 id="steps-title" className="text-[15px] font-semibold">
          {t.stepsTitle}
        </h2>
        <ol className="mt-3 flex flex-col gap-3">
          {t.steps.map((step, i) => (
            <li key={step} className="flex items-center gap-3 text-sm">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-on-primary">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <a
        href={SUPPORT_WHATSAPP.href}
        rel="noopener"
        className="card mt-3 flex min-h-[52px] items-center justify-between px-3.5 text-sm"
      >
        <span className="inline-flex items-center gap-2.5">
          <IconChat size={18} />
          {t.help}
        </span>
        <IconChevron size={16} className="text-muted" />
      </a>
    </AppShell>
  );
}
