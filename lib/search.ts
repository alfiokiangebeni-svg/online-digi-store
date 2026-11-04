/**
 * Recherche tolérante aux fautes, sans dépendance (catalogue de démo).
 * En phase 3, la même logique passe côté Postgres (pg_trgm + unaccent).
 */

export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[’']/g, " ")
    .replace(/[^a-z0-9ɛɔ]+/g, " ")
    .trim();
}

/** Distance de Levenshtein bornée (arrêt anticipé au-delà de `max`). */
export function distance(a: string, b: string, max = 2): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

/** Tolérance selon la longueur du mot : 0 faute (≤ 3 lettres), 1 (≤ 6), 2 au-delà. */
const tolerance = (word: string) => (word.length <= 3 ? 0 : word.length <= 6 ? 1 : 2);

/** Chaque mot de la requête doit correspondre (préfixe ou faute tolérée) à un mot du texte. */
export function matches(query: string, haystack: string): boolean {
  const q = normalize(query).split(" ").filter(Boolean);
  if (q.length === 0) return true;
  const words = normalize(haystack).split(" ").filter(Boolean);
  return q.every((term) => {
    const tol = tolerance(term);
    return words.some(
      (w) =>
        w.startsWith(term) ||
        distance(term, w, tol) <= tol ||
        (w.length > term.length && distance(term, w.slice(0, term.length), tol) <= tol),
    );
  });
}
