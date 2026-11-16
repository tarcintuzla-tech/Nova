export const pad = (n: number) => String(n).padStart(2, '0');
export const todayStr = (d: Date = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const nowIso = () => new Date().toISOString();
export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number);
  return todayStr(new Date(y, m - 1, d + n));
}
/** Last n days, oldest first, ending at `end` (default today). */
export function lastDays(n: number, end: string = todayStr()): string[] {
  return Array.from({ length: n }, (_, i) => addDays(end, i - (n - 1)));
}
export function dayIndex(d: Date = new Date()): number {
  return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
}
export function weekdayLabel(day: string, lang: string): string {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(lang, { weekday: 'short' });
}
export function formatDay(day: string, lang: string): string {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(lang, { day: 'numeric', month: 'long' });
}
