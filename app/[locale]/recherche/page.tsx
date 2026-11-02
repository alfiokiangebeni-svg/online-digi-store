import type { Metadata } from "next";
import { ComingSoon } from "@/components/shell/ComingSoon";
import { getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";

export async function generateMetadata({ params }: PageProps<"/[locale]/recherche">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLocale(params));
  return { title: dict.nav.search, robots: { index: false } };
}

export default async function RecherchePage({ params }: PageProps<"/[locale]/recherche">) {
  const locale = await resolveLocale(params);
  return <ComingSoon locale={locale} dict={await getDictionary(locale)} tab="search" path="recherche" />;
}
