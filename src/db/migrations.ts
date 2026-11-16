import type { Db } from './types';

export const MIGRATIONS: { version: number; sql: string }[] = [
  {
    version: 1,
    sql: `
CREATE TABLE preferences (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);
CREATE TABLE journal_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT NOT NULL, prompt TEXT, body TEXT NOT NULL,
  day TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX idx_journal_kind_day ON journal_entries(kind, day);
CREATE TABLE favorites (content_id TEXT PRIMARY KEY NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE reading_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT, content_id TEXT NOT NULL, read_at TEXT NOT NULL, day TEXT NOT NULL
);
CREATE TABLE habits (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, archived INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL
);
CREATE TABLE habit_completions (habit_id INTEGER NOT NULL, day TEXT NOT NULL, PRIMARY KEY (habit_id, day));
CREATE TABLE goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, done INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL, completed_at TEXT
);
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, day TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL
);
CREATE TABLE kindness_done (
  id INTEGER PRIMARY KEY AUTOINCREMENT, activity_id TEXT NOT NULL, day TEXT NOT NULL, created_at TEXT NOT NULL,
  UNIQUE (activity_id, day)
);
CREATE TABLE quiz_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT, module TEXT NOT NULL, score INTEGER NOT NULL, total INTEGER NOT NULL, taken_at TEXT NOT NULL
);`,
  },
];
export const LATEST_VERSION = MIGRATIONS[MIGRATIONS.length - 1].version;
export const TABLES = [
  'preferences', 'journal_entries', 'favorites', 'reading_history', 'habits',
  'habit_completions', 'goals', 'tasks', 'kindness_done', 'quiz_results',
];

export async function migrate(db: Db): Promise<number> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let current = row?.user_version ?? 0;
  for (const m of MIGRATIONS) {
    if (m.version <= current) continue;
    await db.execAsync('BEGIN');
    try {
      await db.execAsync(m.sql);
      await db.execAsync(`PRAGMA user_version = ${m.version}`);
      await db.execAsync('COMMIT');
      current = m.version;
    } catch (e) {
      await db.execAsync('ROLLBACK').catch(() => undefined);
      throw e;
    }
  }
  return current;
}
