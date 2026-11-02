/** Remplace les variables « {nom} » d'un message traduit. */
export function format(message: string, values: Record<string, string | number>): string {
  return message.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
