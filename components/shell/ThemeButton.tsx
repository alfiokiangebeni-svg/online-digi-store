import { Sheet } from "@/components/ui/Sheet";
import { ThemePicker } from "@/components/ui/ThemePicker";
import { IconTheme } from "@/components/ui/icons";
import type { ThemeChoice } from "@/lib/theme";

/** Bouton de thème de l'en-tête : ouvre le sélecteur (Automatique + 6 thèmes). */
export function ThemeButton({
  label,
  title,
  closeLabel,
  names,
  hint,
  saved,
}: {
  label: string;
  title: string;
  closeLabel: string;
  names: Record<ThemeChoice, string>;
  hint: string;
  saved: string;
}) {
  return (
    <Sheet
      triggerLabel={label}
      triggerIcon={<IconTheme size={21} />}
      triggerIconOnly
      triggerVariant="ghost"
      triggerClassName="size-11 px-0"
      title={title}
      closeLabel={closeLabel}
    >
      <ThemePicker label={title} names={names} hint={hint} saved={saved} />
    </Sheet>
  );
}
