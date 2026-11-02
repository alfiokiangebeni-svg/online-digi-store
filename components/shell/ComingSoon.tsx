import { AppShell, type Tab } from "./AppShell";
import { Button, KubaDivider } from "@/components/ui";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

/** Page d'attente pour les espaces livrés dans les phases suivantes. */
export function ComingSoon({
  locale,
  dict,
  tab,
  path,
}: {
  locale: Locale;
  dict: Dictionary;
  tab: Tab;
  path: string;
}) {
  return (
    <AppShell locale={locale} dict={dict} tab={tab} path={path}>
      <section className="pt-12">
        <h1 className="text-4xl font-bold">{dict.soon.title}</h1>
        <p className="mt-3 max-w-prose text-muted">{dict.soon.body}</p>
        <KubaDivider id={`kuba-soon-${path}`} />
        <Button href={localePath(locale)} variant="secondary">
          {dict.soon.cta}
        </Button>
      </section>
    </AppShell>
  );
}
