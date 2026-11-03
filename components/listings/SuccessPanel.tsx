import Link from "next/link";
import { Stamp } from "@/components/ui/Stamp";
import { buttonClasses } from "@/components/ui/buttonStyles";

/** Confirmation animée (tampon) après candidature, offre, visite ou paiement. */
export function SuccessPanel({
  stamp,
  title,
  body,
  href,
  linkLabel,
  onLink,
}: {
  stamp: string;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
  /** Action à la place du lien (changement d'onglet sur la même page). */
  onLink?: () => void;
}) {
  return (
    <div role="status" className="flex flex-col gap-3">
      <div className="grid place-items-center rounded-[var(--radius-md)] bg-surface-2 py-7">
        <Stamp label={stamp} announce={false} />
      </div>
      <p className="text-lg font-bold">{title}</p>
      <p className="text-sm text-muted">{body}</p>
      {onLink ? (
        <button type="button" onClick={onLink} className={buttonClasses({ variant: "outline", block: true })}>
          {linkLabel}
        </button>
      ) : (
        <Link href={href} className={buttonClasses({ variant: "outline", block: true })}>
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
