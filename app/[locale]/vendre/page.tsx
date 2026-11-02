import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { CategoryIcon, IconChat, IconChevron } from "@/components/ui";
import { Badge } from "@/components/ui/Badge";
import { SUPPORT_WHATSAPP } from "@/lib/brand";
import { CATEGORY_IDS } from "@/lib/categories";
import { format, getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";

export async function generateMetadata({ params }: PageProps<"/[locale]/vendre">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLocale(params));
  return { title: dict.sell.title };
}

/**
 * Onglet « Vendre » : choix de la catégorie. Le formulaire de publication arrive à
 * l'étape 5 ; d'ici là, chaque catégorie ouvre WhatsApp avec le message prêt.
 */
export default async function SellPage({ params }: PageProps<"/[locale]/vendre">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const t = dict.sell;
  const whatsapp = (text: string) => `${SUPPORT_WHATSAPP.href}?text=${encodeURIComponent(text)}`;

  return (
    <AppShell locale={locale} dict={dict} tab="sell" path="vendre" search={false}>
      <h1 className="mt-1 text-[22px] font-bold">{t.title}</h1>
      <p className="mt-1 text-sm text-muted">{t.intro}</p>

      <h2 className="mb-2 mt-4 px-1 text-[17px] font-bold">{t.choose}</h2>
      <ul className="grid grid-cols-2 gap-2">
        {CATEGORY_IDS.map((id) => (
          <li key={id}>
            <a
              href={whatsapp(format(t.whatsappText, { category: dict.categories[id] }))}
              rel="noopener"
              className="card pressable flex min-h-[5.5rem] flex-col justify-between gap-2 p-3 hover:bg-surface-2"
            >
              <span className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-full bg-surface-2">
                  <CategoryIcon id={id} size={20} />
                </span>
                <IconChevron size={16} className="text-muted" />
              </span>
              <span className="text-sm font-semibold">{dict.categories[id]}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2 flex items-start gap-2 px-1 text-xs text-muted">
        <Badge tone="neutral">{dict.account.soon}</Badge>
        <span>{t.formSoon}</span>
      </p>

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
