import type { Db } from '../types';
import { nowIso, todayStr } from '../../utils/date';

export type Entry = { id: number; kind: string; prompt: string | null; body: string; day: string; created_at: string; updated_at: string };

export async function createEntry(db: Db, e: { kind: string; prompt?: string | null; body: string; day?: string }): Promise<number> {
  const now = nowIso();
  const r = await db.runAsync(
    'INSERT INTO journal_entries (kind, prompt, body, day, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    e.kind, e.prompt ?? null, e.body, e.day ?? todayStr(), now, now,
  );
  return r.lastInsertRowId;
}
export async function updateEntry(db: Db, id: number, body: string) {
  await db.runAsync('UPDATE journal_entries SET body = ?, updated_at = ? WHERE id = ?', body, nowIso(), id);
}
export async function deleteEntry(db: Db, id: number) {
  await db.runAsync('DELETE FROM journal_entries WHERE id = ?', id);
}
export async function listEntries(db: Db, kinds?: string[], limit = 200): Promise<Entry[]> {
  if (kinds && kinds.length) {
    const ph = kinds.map(() => '?').join(',');
    return db.getAllAsync<Entry>(`SELECT * FROM journal_entries WHERE kind IN (${ph}) ORDER BY id DESC LIMIT ?`, ...kinds, limit);
  }
  return db.getAllAsync<Entry>('SELECT * FROM journal_entries ORDER BY id DESC LIMIT ?', limit);
}
export async function getTodayEntry(db: Db, kind: string, day = todayStr()): Promise<Entry | null> {
  return db.getFirstAsync<Entry>('SELECT * FROM journal_entries WHERE kind = ? AND day = ? ORDER BY id DESC LIMIT 1', kind, day);
}
