import type { Db } from '../types';
import { nowIso } from '../../utils/date';

export type DayActivity = { habits: number; tasks: number; kindness: number; journal: number };

export async function activityByDay(db: Db, days: string[]): Promise<Record<string, DayActivity>> {
  const out: Record<string, DayActivity> = {};
  days.forEach((d) => { out[d] = { habits: 0, tasks: 0, kindness: 0, journal: 0 }; });
  if (!days.length) return out;
  const ph = days.map(() => '?').join(',');
  const fill = async (sql: string, key: keyof DayActivity) => {
    const rows = await db.getAllAsync<{ day: string; c: number }>(sql, ...days);
    rows.forEach((r) => { if (out[r.day]) out[r.day][key] = r.c; });
  };
  await fill(`SELECT day, COUNT(*) AS c FROM habit_completions WHERE day IN (${ph}) GROUP BY day`, 'habits');
  await fill(`SELECT day, COUNT(*) AS c FROM tasks WHERE done = 1 AND day IN (${ph}) GROUP BY day`, 'tasks');
  await fill(`SELECT day, COUNT(*) AS c FROM kindness_done WHERE day IN (${ph}) GROUP BY day`, 'kindness');
  await fill(`SELECT day, COUNT(*) AS c FROM journal_entries WHERE day IN (${ph}) GROUP BY day`, 'journal');
  return out;
}

export type Totals = { journal: number; habits: number; tasks: number; goals: number; kindness: number; reads: number; quizzes: number };

export async function totals(db: Db): Promise<Totals> {
  const one = async (sql: string) => (await db.getFirstAsync<{ c: number }>(sql))?.c ?? 0;
  return {
    journal: await one('SELECT COUNT(*) AS c FROM journal_entries'),
    habits: await one('SELECT COUNT(*) AS c FROM habit_completions'),
    tasks: await one('SELECT COUNT(*) AS c FROM tasks WHERE done = 1'),
    goals: await one('SELECT COUNT(*) AS c FROM goals WHERE done = 1'),
    kindness: await one('SELECT COUNT(*) AS c FROM kindness_done'),
    reads: await one('SELECT COUNT(DISTINCT content_id) AS c FROM reading_history'),
    quizzes: await one('SELECT COUNT(*) AS c FROM quiz_results'),
  };
}
export async function saveQuiz(db: Db, module: string, score: number, total: number) {
  await db.runAsync('INSERT INTO quiz_results (module, score, total, taken_at) VALUES (?, ?, ?, ?)', module, score, total, nowIso());
}
