import type { Db } from '../types';
import { nowIso } from '../../utils/date';

export type Habit = { id: number; name: string; archived: number; created_at: string };

export async function createHabit(db: Db, name: string): Promise<number> {
  const r = await db.runAsync('INSERT INTO habits (name, created_at) VALUES (?, ?)', name, nowIso());
  return r.lastInsertRowId;
}
export async function archiveHabit(db: Db, id: number) {
  await db.runAsync('UPDATE habits SET archived = 1 WHERE id = ?', id);
}
export async function listHabits(db: Db): Promise<Habit[]> {
  return db.getAllAsync<Habit>('SELECT * FROM habits WHERE archived = 0 ORDER BY id');
}
/** Returns true if the habit is now completed for that day. */
export async function toggleCompletion(db: Db, habitId: number, day: string): Promise<boolean> {
  const r = await db.runAsync('DELETE FROM habit_completions WHERE habit_id = ? AND day = ?', habitId, day);
  if (r.changes > 0) return false;
  await db.runAsync('INSERT INTO habit_completions (habit_id, day) VALUES (?, ?)', habitId, day);
  return true;
}
export async function completionsOnDay(db: Db, day: string): Promise<number[]> {
  const rows = await db.getAllAsync<{ habit_id: number }>('SELECT habit_id FROM habit_completions WHERE habit_id IN (SELECT id FROM habits WHERE archived = 0) AND day = ?', day);
  return rows.map((r) => r.habit_id);
}
export async function completionDays(db: Db, habitId: number, fromDay: string): Promise<string[]> {
  const rows = await db.getAllAsync<{ day: string }>('SELECT day FROM habit_completions WHERE habit_id = ? AND day >= ? ORDER BY day', habitId, fromDay);
  return rows.map((r) => r.day);
}
export async function countCompletions(db: Db, habitId: number): Promise<number> {
  const r = await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) AS c FROM habit_completions WHERE habit_id = ?', habitId);
  return r?.c ?? 0;
}
