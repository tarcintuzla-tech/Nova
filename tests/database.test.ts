import { makeDb, rawDb } from './helpers';
import { LATEST_VERSION, TABLES, migrate } from '../src/db/migrations';
import { allPrefs, setPref } from '../src/db/repos/prefs';
import { exportAll, deleteAll } from '../src/db/repos/data';
import { createEntry, listEntries } from '../src/db/repos/journal';
import { totals } from '../src/db/repos/stats';
import type { Db } from '../src/db/types';

describe('database & migrations', () => {
  it('migrates a new database to the latest version and creates all tables', async () => {
    const db = rawDb();
    expect(await migrate(db)).toBe(LATEST_VERSION);
    for (const t of TABLES) {
      const row = await db.getFirstAsync('SELECT name FROM sqlite_master WHERE type = ? AND name = ?', 'table', t);
      expect(row).not.toBeNull();
    }
  });
  it('is idempotent', async () => {
    const db = await makeDb();
    expect(await migrate(db)).toBe(LATEST_VERSION);
  });
  it('stores and updates preferences', async () => {
    const db = await makeDb();
    await setPref(db, 'language', JSON.stringify('en'));
    await setPref(db, 'language', JSON.stringify('tr'));
    expect(await allPrefs(db)).toEqual({ language: '"tr"' });
  });
  it('empty database yields empty lists and zero totals (empty states)', async () => {
    const db = await makeDb();
    expect(await listEntries(db)).toEqual([]);
    expect(Object.values(await totals(db)).every((v) => v === 0)).toBe(true);
  });
  it('exports and deletes personal data', async () => {
    const db = await makeDb();
    await createEntry(db, { kind: 'journal', body: 'hello' });
    const data = await exportAll(db);
    expect(data.tables.journal_entries).toHaveLength(1);
    expect(data.schemaVersion).toBe(LATEST_VERSION);
    await deleteAll(db);
    expect(await listEntries(db)).toEqual([]);
  });
  it('rolls back and rethrows when a migration fails (error state)', async () => {
    const calls: string[] = [];
    const broken: Db = {
      ...rawDb(),
      async getFirstAsync<T>() { return { user_version: 0 } as unknown as T; },
      async execAsync(sql: string) { calls.push(sql.trim().slice(0, 8)); if (sql.includes('CREATE TABLE')) throw new Error('boom'); },
    };
    await expect(migrate(broken)).rejects.toThrow('boom');
    expect(calls).toContain('ROLLBACK');
  });
});
