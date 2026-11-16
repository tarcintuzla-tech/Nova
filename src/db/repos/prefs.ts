import type { Db } from '../types';

export async function setPref(db: Db, key: string, value: string) {
  await db.runAsync('INSERT INTO preferences (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', key, value);
}
export async function allPrefs(db: Db): Promise<Record<string, string>> {
  const rows = await db.getAllAsync<{ key: string; value: string }>('SELECT key, value FROM preferences');
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
