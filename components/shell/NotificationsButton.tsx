import Link from "next/link";
import { Sheet } from "@/components/ui/Sheet";
import { Badge } from "@/components/ui/Badge";
import { IconBell, IconChevron } from "@/components/ui/icons";

export interface NotificationItem {
  title: string;
  body: string;
  href: string;
}

/** Cloche de l'en-tête : feuille avec les notifications (démo, sans serveur). */
export function NotificationsButton({
  label,
  title,
  demo,
  closeLabel,
  items,
}: {
  label: string;
  title: string;
  demo: string;
  closeLabel: string;
  items: NotificationItem[];
}) {
  return (
    <Sheet
      triggerLabel={label}
      triggerIcon={<IconBell size={22} />}
      triggerIconOnly
      triggerVariant="ghost"
      triggerClassName="size-11 px-0"
      title={title}
      closeLabel={closeLabel}
    >
      <Badge tone="neutral" className="self-start">
        {demo}
      </Badge>
      <ul className="-mx-1 flex flex-col">
        {items.map((n) => (
          <li key={n.title}>
            <Link
              href={n.href}
              prefetch={false}
              className="flex min-h-14 items-center gap-3 rounded-[var(--radius-sm)] px-1 py-2 hover:bg-surface-2"
            >
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-primary" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-semibold">{n.title}</span>
                <span className="text-xs text-muted">{n.body}</span>
              </span>
              <IconChevron size={16} className="shrink-0 text-muted" />
            </Link>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}
