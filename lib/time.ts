/** Kinshasa est en UTC+1 toute l'année (pas d'heure d'été). */
const KINSHASA_OFFSET_MS = 60 * 60 * 1000;

/**
 * Prochain vendredi 23 h 59 (heure de Kinshasa) : fin des « Offres de la semaine »
 * (docs/ROADMAP.md : une vente flash chaque vendredi soir).
 */
export function nextFridayNight(now: number): number {
  const local = new Date(now + KINSHASA_OFFSET_MS);
  const day = local.getUTCDay(); // 5 = vendredi
  const end = new Date(local);
  end.setUTCDate(local.getUTCDate() + ((5 - day + 7) % 7));
  end.setUTCHours(23, 59, 0, 0);
  if (end.getTime() <= local.getTime()) end.setUTCDate(end.getUTCDate() + 7);
  return end.getTime() - KINSHASA_OFFSET_MS;
}
