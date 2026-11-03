"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { buttonClasses } from "@/components/ui/buttonStyles";
import { Sheet } from "@/components/ui/Sheet";
import { IconFlag, IconLink, IconMessage, IconShare, IconStar } from "@/components/ui/icons";
import { cn } from "@/components/ui/cn";
import { recentStore, reportsStore, reviewsStore } from "@/lib/client/feedbackStores";
import { useStore } from "@/lib/client/store";
import { toast } from "@/lib/client/toast";
import type { Dictionary } from "@/lib/i18n";
import { format } from "@/lib/i18n/format";

export type ActionTexts = Dictionary["actions"];

const noop = () => () => {};
/** Adresse publique de la fiche : site configuré, sinon l'adresse affichée. */
function usePageUrl(path: string) {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  return useSyncExternalStore(
    noop,
    () => (site ? `${site}${path}` : window.location.href.split("#")[0]),
    () => (site ? `${site}${path}` : path),
  );
}

/** Partager : WhatsApp, Facebook, copier le lien. */
export function ShareSheet({
  path,
  text,
  t,
  closeLabel,
}: {
  path: string;
  text: string;
  t: ActionTexts;
  closeLabel: string;
}) {
  const url = usePageUrl(path);
  const message = `${text} ${url}`;
  const row =
    "flex min-h-12 w-full items-center gap-3 rounded-[var(--radius-sm)] px-2 text-sm font-medium hover:bg-surface-2";
  return (
    <Sheet
      triggerLabel={t.share}
      triggerVariant="ghost"
      triggerIcon={<IconShare size={18} />}
      triggerClassName="px-2"
      title={t.shareTitle}
      closeLabel={closeLabel}
    >
      {(close) => (
        <ul className="-mx-2 flex flex-col">
          <li>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener"
              className={row}
              onClick={close}
            >
              <IconMessage size={20} />
              {t.whatsapp}
            </a>
          </li>
          <li>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener"
              className={row}
              onClick={close}
            >
              <IconShare size={20} />
              {t.facebook}
            </a>
          </li>
          <li>
            <button
              type="button"
              className={row}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(url);
                  toast({ tone: "success", message: t.linkCopied });
                } catch {
                  toast({ tone: "error", message: format(t.copyFailed, { url }) });
                }
                close();
              }}
            >
              <IconLink size={20} />
              {t.copyLink}
            </button>
          </li>
        </ul>
      )}
    </Sheet>
  );
}

/** Signaler une fiche ou une annonce (motif obligatoire). */
export function ReportSheet({ slug, t, closeLabel }: { slug: string; t: ActionTexts; closeLabel: string }) {
  const reports = useStore(reportsStore);
  const done = reports.some((r) => r.slug === slug);
  const [reason, setReason] = useState<string>();
  const [error, setError] = useState<string>();
  return (
    <Sheet
      triggerLabel={done ? t.reported : t.report}
      triggerVariant="ghost"
      triggerIcon={<IconFlag size={18} />}
      triggerClassName="px-2"
      title={t.reportTitle}
      closeLabel={closeLabel}
    >
      {(close) => (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!reason) return setError(t.reportPick);
            reportsStore.set((r) => [...r.filter((x) => x.slug !== slug), { slug, reason, at: Date.now() }]);
            toast({ tone: "success", message: t.reportDone });
            close();
          }}
        >
          <fieldset className="flex flex-col">
            <legend className="mb-1 text-[13px] font-medium text-muted">{t.reportReason}</legend>
            {t.reasons.map((r) => (
              <label key={r} className="flex min-h-11 items-center gap-3 text-sm">
                <input
                  type="radio"
                  name={`report-${slug}`}
                  value={r}
                  checked={reason === r}
                  onChange={() => {
                    setReason(r);
                    setError(undefined);
                  }}
                  className="size-5 accent-primary"
                />
                {r}
              </label>
            ))}
            {error ? <p className="text-xs font-medium text-urgent-text">{error}</p> : null}
          </fieldset>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`report-details-${slug}`} className="text-[13px] font-medium text-muted">
              {t.reportDetails}
            </label>
            <textarea
              id={`report-details-${slug}`}
              rows={2}
              className="rounded-[var(--radius-sm)] border border-line bg-surface-2 p-3 text-[15px] outline-none focus:border-primary"
            />
          </div>
          <Button type="submit" variant="danger" block>
            {t.reportSend}
          </Button>
        </form>
      )}
    </Sheet>
  );
}

/** « Contacter le vendeur » : WhatsApp du support avec le message prêt (démo). */
export function ContactLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={buttonClasses({ variant: "ghost", className: "px-2" })}
    >
      <IconMessage size={18} />
      {label}
    </a>
  );
}

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <IconStar key={n} size={size} className={n <= value ? "text-star" : "text-line"} />
      ))}
    </span>
  );
}

/** Avis : exemples (démo), ton avis, et le formulaire note + commentaire. */
export function ReviewsBlock({ slug, t, closeLabel }: { slug: string; t: ActionTexts; closeLabel: string }) {
  const reviews = useStore(reviewsStore);
  const mine = reviews.find((r) => r.slug === slug);
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState<string>();

  return (
    <div className="flex flex-col gap-3">
      {mine ? (
        <div className="rounded-[var(--radius-sm)] border border-primary p-3">
          <p className="flex items-center gap-2 text-sm font-semibold">
            {t.yourReview} <Stars value={mine.stars} />
            <span className="sr-only">{format(t.starLabel, { n: mine.stars })}</span>
          </p>
          {mine.text ? <p className="mt-1 text-sm">{mine.text}</p> : null}
        </div>
      ) : null}
      <p className="text-xs font-semibold text-muted">{t.samples}</p>
      <ul className="flex flex-col gap-2">
        {t.sampleReviews.map((r) => (
          <li key={r.name} className="text-sm">
            <p className="flex items-center gap-2 font-semibold">
              {r.name} <Stars value={r.stars} size={12} />
              <span className="sr-only">{format(t.starLabel, { n: r.stars })}</span>
            </p>
            <p className="text-muted">{r.text}</p>
          </li>
        ))}
      </ul>
      <Sheet
        triggerLabel={mine ? t.reviewEdit : t.review}
        triggerVariant="outline"
        triggerIcon={<IconStar size={18} />}
        title={t.reviewTitle}
        closeLabel={closeLabel}
      >
        {(close) => (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!stars) return setError(t.reviewPick);
              reviewsStore.set((r) => [
                { slug, stars, text: text.trim(), at: Date.now() },
                ...r.filter((x) => x.slug !== slug),
              ]);
              toast({ tone: "success", message: t.reviewDone });
              close();
            }}
          >
            <div role="radiogroup" aria-label={t.stars} className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={stars === n}
                  aria-label={format(t.starLabel, { n })}
                  onClick={() => {
                    setStars(n);
                    setError(undefined);
                  }}
                  className="grid size-11 place-items-center rounded-[var(--radius-sm)] hover:bg-surface-2"
                >
                  <IconStar size={28} className={cn(n <= stars ? "text-star" : "text-line")} />
                </button>
              ))}
            </div>
            {error ? <p className="text-xs font-medium text-urgent-text">{error}</p> : null}
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`review-${slug}`} className="text-[13px] font-medium text-muted">
                {t.reviewText}
              </label>
              <textarea
                id={`review-${slug}`}
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="rounded-[var(--radius-sm)] border border-line bg-surface-2 p-3 text-[15px] outline-none focus:border-primary"
              />
            </div>
            <Button type="submit" block>
              {t.reviewSend}
            </Button>
          </form>
        )}
      </Sheet>
    </div>
  );
}

/** Mémorise la fiche consultée (rayon « Récemment consultés » de l'accueil). */
export function TrackRecent({ id }: { id: string }) {
  useEffect(() => {
    recentStore.set((list) => [id, ...list.filter((x) => x !== id)].slice(0, 12));
  }, [id]);
  return null;
}
