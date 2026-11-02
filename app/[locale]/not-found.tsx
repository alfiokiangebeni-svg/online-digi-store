import { Button, KubaDivider } from "@/components/ui";
import { getDictionary } from "@/lib/i18n";

/**
 * 404 dans une langue valide. La langue n'est pas connue ici (pas de params),
 * on affiche donc le français, langue par défaut.
 */
export default async function NotFound() {
  const dict = await getDictionary("fr");
  return (
    <main id="contenu" className="mx-auto max-w-5xl px-4 pt-16">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="mt-2 text-4xl font-bold">{dict.notFound.title}</h1>
      <p className="mt-3 max-w-prose text-muted">{dict.notFound.body}</p>
      <KubaDivider id="kuba-404" />
      <Button href="/" variant="secondary">
        {dict.notFound.cta}
      </Button>
    </main>
  );
}
