import type { Db } from '../types';
import { nowIso, todayStr } from '../../utils/date';

/** Returns true if the item is now a favorite. */
export async function toggleFavorite(db: Db, contentId: string): Promise<boolean> {
  const existing = await db.getFirstAsync<{ content_id: string }>('SELECT content_id FROM favorites WHERE content_id = ?', contentId);
  if (existing) {
    await db.runAsync('DELETE FROM favorites WHERE content_id = ?', contentId);
    return false;
  }
  await db.runAsync('INSERT INTO favorites (content_id, created_at) VALUES (?, ?)', contentId, nowIso());
  return true;
}
export async function listFavoriteIds(db: Db): Promise<string[]> {
  const rows = await db.getAllAsync<{ content_id: string }>('SELECT content_id FROM favorites ORDER BY created_at DESC, rowid DESC');
  return rows.map((r) => r.content_id);
}
export async function markRead(db: Db, contentId: string) {
  await db.runAsync('INSERT INTO reading_history (content_id, read_at, day) VALUES (?, ?, ?)', contentId, nowIso(), todayStr());
}
export async function listHistory(db: Db, limit = 50): Promise<{ content_id: string; read_at: string }[]> {
  return db.getAllAsync('SELECT content_id, MAX(read_at) AS read_at FROM reading_history GROUP BY content_id ORDER BY read_at DESC LIMIT ?', limit);
}
