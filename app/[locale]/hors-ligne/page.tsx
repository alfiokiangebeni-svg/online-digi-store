import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { RetryButton } from "@/components/feedback/RetryButton";
import { Button, KubaDivider } from "@/components/ui";
import { localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";

export async function generateMetadata({ params }: PageProps<"/[locale]/hors-ligne">): Promise<Metadata> {
  const dict = await getDictionary(await resolveLocale(params));
  return { title: dict.offline.title, robots: { index: false } };
}

/** Page servie par le service worker quand le réseau est absent. */
export default async function OfflinePage({ params }: PageProps<"/[locale]/hors-ligne">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  return (
    <AppShell locale={locale} dict={dict} tab={null} path="hors-ligne">
      <section className="pt-12">
        <h1 className="text-4xl font-bold">{dict.offline.title}</h1>
        <p className="mt-3 max-w-prose text-muted">{dict.offline.body}</p>
        <KubaDivider id="kuba-offline" />
        <div className="flex flex-wrap gap-3">
          <Button href={localePath(locale, "bibliotheque")}>{dict.nav.library}</Button>
          <RetryButton label={dict.offline.cta} />
        </div>
      </section>
    </AppShell>
  );
}
