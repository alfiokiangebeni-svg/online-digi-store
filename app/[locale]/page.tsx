import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { ProductTicket } from "@/components/shop/ProductTicket";
import { Badge, Button, KubaDivider, Rail, Story } from "@/components/ui";
import { DEMO_PRODUCTS, productsForRail, type Rail as RailId } from "@/lib/demo/products";
import { localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n/params";

const RAILS: RailId[] = ["trending", "under5", "author", "kids", "creators"];
const DROPS = ["p1", "p3", "p8", "p2", "p10", "p6"];

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = await resolveLocale(params);
  const dict = await getDictionary(locale);
  const drops = DROPS.map((id) => DEMO_PRODUCTS.find((p) => p.id === id)!).filter(Boolean);

  return (
    <AppShell locale={locale} dict={dict} tab="discover">
      <section aria-labelledby="hero-title" className="pt-8">
        <Badge tone="flash">{dict.home.kicker}</Badge>
        <h1 id="hero-title" className="mt-3 max-w-[16ch] text-[2.6rem] font-bold sm:text-6xl">
          {dict.home.title}
        </h1>
        <p className="mt-4 max-w-prose text-lg text-muted">{dict.home.body}</p>
        <div className="mt-6">
          <Button href="#drops" size="lg" variant="secondary">
            {dict.home.cta}
          </Button>
        </div>
        <ul className="mt-6 flex flex-col gap-1 text-sm text-muted sm:flex-row sm:gap-6">
          <li className="font-mono">{dict.home.trust.operators}</li>
          <li>{dict.home.trust.delivery}</li>
        </ul>
      </section>

      <section id="drops" aria-labelledby="drops-title" className="mt-10 scroll-mt-4">
        <h2 id="drops-title" className="sr-only">
          {dict.home.storiesLabel}
        </h2>
        <ul className="scroll-rail -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
          {drops.map((p, i) => (
            <li key={p.id}>
              <Story title={p.title} tone={p.tone} seen={i > 2} />
            </li>
          ))}
        </ul>
      </section>

      <KubaDivider id="kuba-home-1" />

      {RAILS.map((rail) => (
        <Rail
          key={rail}
          id={`rail-${rail}`}
          title={dict.home.rails[rail]}
          action={
            <Link
              href={localePath(locale, "recherche")}
              prefetch={false}
              className="inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4"
            >
              {dict.home.seeAll}
            </Link>
          }
        >
          {productsForRail(rail).map((p) => (
            <ProductTicket key={p.id} product={p} locale={locale} dict={dict} />
          ))}
        </Rail>
      ))}
    </AppShell>
  );
}
