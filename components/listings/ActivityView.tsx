"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { IconBell, IconChevron, IconHeart } from "@/components/ui/icons";
import { activityStore, alertsStore, type ActivityKind, type ActivityStatus } from "@/lib/client/activity";
import { favoritesStore } from "@/lib/client/shop";
import { useStore } from "@/lib/client/store";
import type { RecentItem } from "@/components/shop/recentItems";

export interface ActivityLabels {
  title: string;
  empty: string;
  kinds: Record<ActivityKind, string>;
  status: Record<ActivityStatus, string>;
  savedTitle: string;
  alertsTitle: string;
}

/** Compte › Mes activités : suivi des démarches, annonces sauvegardées, alertes. */
export function ActivityView({
  labels: t,
  listings,
  categoryNames,
  locale,
}: {
  labels: ActivityLabels;
  listings: Record<string, RecentItem>;
  categoryNames: Record<string, string>;
  locale: string;
}) {
  const activity = useStore(activityStore);
  const saved = useStore(favoritesStore).filter((s) => listings[s]);
  const alerts = useStore(alertsStore);
  const date = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "fr-CD", {
    day: "numeric",
    month: "short",
  });

  return (
    <section id="activites" aria-labelledby="activity-title" className="card scroll-mt-32 p-3.5">
      <h2 id="activity-title" className="text-[15px] font-semibold">
        {t.title}
      </h2>
      {activity.length ? (
        <ul className="mt-2 flex flex-col">
          {activity.map((a) => {
            const body = (
              <>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-xs text-muted">
                    {t.kinds[a.kind]} · {date.format(a.at)}
                  </span>
                  <span className="truncate text-sm font-semibold">{a.title}</span>
                  {a.detail ? <span className="truncate text-xs text-muted">{a.detail}</span> : null}
                </span>
                <Badge tone={a.status === "paid" || a.status === "sent" ? "success" : "neutral"}>
                  {t.status[a.status]}
                </Badge>
              </>
            );
            const href = a.slug ? listings[a.slug]?.href : undefined;
            return (
              <li key={a.id} className="border-b border-line last:border-b-0">
                {href ? (
                  <Link href={href} prefetch={false} className="flex min-h-14 items-center gap-3 py-2">
                    {body}
                  </Link>
                ) : (
                  <div className="flex min-h-14 items-center gap-3 py-2">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-1 text-xs text-muted">{t.empty}</p>
      )}

      {saved.length ? (
        <>
          <h3 className="mt-4 flex items-center gap-2 text-sm font-semibold">
            <IconHeart size={16} /> {t.savedTitle}
          </h3>
          <ul className="mt-1">
            {saved.map((s) => (
              <li key={s}>
                <Link
                  href={listings[s].href}
                  prefetch={false}
                  className="flex min-h-12 items-center gap-3 border-b border-line text-sm last:border-b-0"
                >
                  <span className="min-w-0 flex-1 truncate">{listings[s].title}</span>
                  <IconChevron size={16} className="text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {alerts.length ? (
        <p className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <IconBell size={16} />
          <span className="font-semibold">{t.alertsTitle} :</span>
          {alerts.map((c) => (
            <Badge key={c} tone="neutral">
              {categoryNames[c] ?? c}
            </Badge>
          ))}
        </p>
      ) : null}
    </section>
  );
}
