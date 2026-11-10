import { Badge } from "@/components/ui/Badge";
import { IconCalendar } from "@/components/ui/icons";
import { format } from "@/lib/i18n/format";
import { URGENT_DAYS } from "@/lib/listings";

/** « Clôture dans 12 j » : rouge quand il reste moins de 3 jours. */
export function DeadlineBadge({ days, label }: { days: number; label: string }) {
  return (
    <Badge tone={days <= URGENT_DAYS ? "urgent" : "neutral"} icon={<IconCalendar size={12} />}>
      {format(label, { days })}
    </Badge>
  );
}
