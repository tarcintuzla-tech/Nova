import type { Db } from '../types';
import { LATEST_VERSION, TABLES } from '../migrations';
import { nowIso } from '../../utils/date';

export async function exportAll(db: Db) {
  const tables: Record<string, unknown[]> = {};
  for (const t of TABLES) tables[t] = await db.getAllAsync(`SELECT * FROM ${t}`);
  return { app: 'NOVA', schemaVersion: LATEST_VERSION, exportedAt: nowIso(), tables };
}
export async function deleteAll(db: Db) {
  await db.execAsync('BEGIN');
  try {
    for (const t of TABLES) await db.execAsync(`DELETE FROM ${t}`);
    await db.execAsync('COMMIT');
  } catch (e) {
    await db.execAsync('ROLLBACK').catch(() => undefined);
    throw e;
  }
}
