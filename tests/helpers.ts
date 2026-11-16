import Database from 'better-sqlite3';
import { migrate } from '../src/db/migrations';
import type { Db } from '../src/db/types';

export function rawDb(): Db {
  const raw = new Database(':memory:');
  return {
    async execAsync(sql) { raw.exec(sql); },
    async runAsync(sql, ...p) {
      const r = raw.prepare(sql).run(...(p as never[]));
      return { lastInsertRowId: Number(r.lastInsertRowid), changes: r.changes };
    },
    async getAllAsync<T>(sql: string, ...p: unknown[]) { return raw.prepare(sql).all(...(p as never[])) as T[]; },
    async getFirstAsync<T>(sql: string, ...p: unknown[]) { return ((raw.prepare(sql).get(...(p as never[])) as T | undefined) ?? null); },
  };
}
export async function makeDb(): Promise<Db> {
  const db = rawDb();
  await migrate(db);
  return db;
}
