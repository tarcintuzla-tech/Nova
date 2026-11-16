import type { Db } from '../types';
import { nowIso } from '../../utils/date';

export type Goal = { id: number; title: string; done: number; created_at: string; completed_at: string | null };
export type Task = { id: number; title: string; day: string; done: number; created_at: string };

export async function createGoal(db: Db, title: string): Promise<number> {
  const r = await db.runAsync('INSERT INTO goals (title, created_at) VALUES (?, ?)', title, nowIso());
  return r.lastInsertRowId;
}
export async function toggleGoal(db: Db, id: number): Promise<boolean> {
  const g = await db.getFirstAsync<Goal>('SELECT * FROM goals WHERE id = ?', id);
  if (!g) return false;
  const done = g.done ? 0 : 1;
  await db.runAsync('UPDATE goals SET done = ?, completed_at = ? WHERE id = ?', done, done ? nowIso() : null, id);
  return !!done;
}
export async function deleteGoal(db: Db, id: number) {
  await db.runAsync('DELETE FROM goals WHERE id = ?', id);
}
export async function listGoals(db: Db): Promise<Goal[]> {
  return db.getAllAsync<Goal>('SELECT * FROM goals ORDER BY done, id DESC');
}

export async function createTask(db: Db, title: string, day: string): Promise<number> {
  const r = await db.runAsync('INSERT INTO tasks (title, day, created_at) VALUES (?, ?, ?)', title, day, nowIso());
  return r.lastInsertRowId;
}
export async function toggleTask(db: Db, id: number) {
  await db.runAsync('UPDATE tasks SET done = 1 - done WHERE id = ?', id);
}
export async function deleteTask(db: Db, id: number) {
  await db.runAsync('DELETE FROM tasks WHERE id = ?', id);
}
export async function listTasks(db: Db, day: string): Promise<Task[]> {
  return db.getAllAsync<Task>('SELECT * FROM tasks WHERE day = ? ORDER BY id', day);
}
