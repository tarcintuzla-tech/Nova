import { makeDb } from './helpers';
import { createEntry, deleteEntry, getTodayEntry, listEntries, updateEntry } from '../src/db/repos/journal';

describe('journal', () => {
  it('creates, edits and deletes entries', async () => {
    const db = await makeDb();
    const id = await createEntry(db, { kind: 'journal', body: 'first' });
    await updateEntry(db, id, 'edited');
    const [e] = await listEntries(db, ['journal']);
    expect(e.body).toBe('edited');
    await deleteEntry(db, id);
    expect(await listEntries(db)).toHaveLength(0);
  });
  it('filters by kind and finds the daily answer for a day', async () => {
    const db = await makeDb();
    await createEntry(db, { kind: 'daily', body: 'a', day: '2026-01-01' });
    await createEntry(db, { kind: 'gratitude', body: 'b', day: '2026-01-01' });
    expect(await listEntries(db, ['gratitude'])).toHaveLength(1);
    expect((await getTodayEntry(db, 'daily', '2026-01-01'))?.body).toBe('a');
    expect(await getTodayEntry(db, 'daily', '2026-01-02')).toBeNull();
  });
});
