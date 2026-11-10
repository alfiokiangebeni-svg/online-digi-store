import type { CategoryId } from "@/lib/theme";
import { IconApps, IconBook, IconBriefcase, IconBuilding, IconImage, IconMusic, IconTender } from "./icons";

const ICONS = {
  books: IconBook,
  apps: IconApps,
  realestate: IconBuilding,
  jobs: IconBriefcase,
  music: IconMusic,
  images: IconImage,
  tenders: IconTender,
} as const;

/** Icône d'une catégorie (une seule famille d'icônes au trait). */
export function CategoryIcon({
  id,
  size = 22,
  className,
}: {
  id: CategoryId;
  size?: number;
  className?: string;
}) {
  const Icon = ICONS[id];
  return <Icon size={size} className={className} />;
}
