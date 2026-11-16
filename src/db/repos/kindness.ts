import type { Db } from '../types';
import { nowIso } from '../../utils/date';

export async function markKindness(db: Db, activityId: string, day: string) {
  await db.runAsync('INSERT OR IGNORE INTO kindness_done (activity_id, day, created_at) VALUES (?, ?, ?)', activityId, day, nowIso());
}
export async function unmarkKindness(db: Db, activityId: string, day: string) {
  await db.runAsync('DELETE FROM kindness_done WHERE activity_id = ? AND day = ?', activityId, day);
}
export async function doneOnDay(db: Db, day: string): Promise<string[]> {
  const rows = await db.getAllAsync<{ activity_id: string }>('SELECT activity_id FROM kindness_done WHERE day = ?', day);
  return rows.map((r) => r.activity_id);
}
export async function listKindness(db: Db, limit = 100): Promise<{ activity_id: string; day: string }[]> {
  return db.getAllAsync('SELECT activity_id, day FROM kindness_done ORDER BY day DESC, id DESC LIMIT ?', limit);
}
