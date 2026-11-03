import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { CopyTextButton } from "@/components/listings/CopyTextButton";
import { usd } from "@/components/listings/text";
import { localePath } from "@/lib/i18n/config";
import { format, getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";
import { getListing, listingsIn } from "@/lib/listings";

export function generateStaticParams() {
  return listingsIn("tenders").map((l) => ({ slug: l.slug }));
}

async function load(params: Promise<{ locale: string; slug: string }>) {
  const locale = await resolveLocale(params);
  const l = getListing((await params).slug);
  if (!l || l.category !== "tenders") notFound();
  return { locale, l, dict: await getDictionary(locale) };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/annonce/[slug]/cahier">): Promise<Metadata> {
  const { l, dict } = await load(params);
  return { title: `${dict.listing.docTitle} · ${l.reference}` };
}

/** Cahier des charges d'un appel d'offres : lisible hors-ligne, texte copiable. */
export default async function SpecsPage({ params }: PageProps<"/[locale]/annonce/[slug]/cahier">) {
  const { locale, l, dict } = await load(params);
  const t = dict.listing;
  const lines = [
    `${t.docTitle} — ${l.reference}`,
    l.title,
    `${t.infos.organization} : ${l.publisher}`,
    `${t.infos.budget} : ${format(t.budget, { min: usd(l.budgetUsd[0]), max: usd(l.budgetUsd[1]) })}`,
    `${t.infos.deadline} : ${format(t.deadline, { days: l.deadlineDays })}`,
    "",
    l.description,
    "",
    `${t.sections.specs} :`,
    ...l.specs.map((s) => `• ${s}`),
    "",
    `${t.sections.documents} :`,
    ...l.documents.map((d) => `• ${d}`),
  ];
  return (
    <AppShell
      locale={locale}
      dict={dict}
      tab={null}
      path={`annonce/${l.slug}/cahier`}
      back={localePath(locale, `annonce/${l.slug}`)}
      search={false}
    >
      <article className="card flex flex-col gap-3 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {t.docTitle} · {l.reference}
        </p>
        <h1 className="text-xl font-bold">{l.title}</h1>
        <p className="text-sm text-muted">{l.publisher}</p>
        <p className="text-sm leading-relaxed">{l.description}</p>
        <h2 className="text-base font-bold">{t.sections.specs}</h2>
        <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm">
          {l.specs.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <h2 className="text-base font-bold">{t.sections.documents}</h2>
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm">
          {l.documents.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <CopyTextButton text={lines.join("\n")} label={t.copy} done={t.copied} failed={t.copyFailed} />
      </article>
    </AppShell>
  );
}
