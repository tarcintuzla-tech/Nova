import * as SQLite from 'expo-sqlite';
import { migrate } from './migrations';
import type { Db } from './types';

let pending: Promise<Db> | null = null;

export function getDb(): Promise<Db> {
  if (!pending) {
    pending = (async () => {
      const raw = await SQLite.openDatabaseAsync('nova.db');
      await raw.execAsync('PRAGMA journal_mode = WAL;');
      const db = raw as unknown as Db;
      await migrate(db);
      return db;
    })();
    pending.catch(() => { pending = null; }); // allow retry after failure
  }
  return pending;
}
