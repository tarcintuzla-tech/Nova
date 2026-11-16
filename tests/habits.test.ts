import { makeDb } from './helpers';
import { archiveHabit, completionDays, completionsOnDay, countCompletions, createHabit, listHabits, toggleCompletion } from '../src/db/repos/habits';
import { activityByDay } from '../src/db/repos/stats';
import { addDays, lastDays } from '../src/utils/date';

describe('habits', () => {
  it('creates a custom habit and toggles completion', async () => {
    const db = await makeDb();
    const id = await createHabit(db, 'Water');
    expect(await toggleCompletion(db, id, '2026-03-01')).toBe(true);
    expect(await completionsOnDay(db, '2026-03-01')).toEqual([id]);
    expect(await toggleCompletion(db, id, '2026-03-01')).toBe(false);
    expect(await countCompletions(db, id)).toBe(0);
  });
  it('lists completion days from a date and archives habits', async () => {
    const db = await makeDb();
    const id = await createHabit(db, 'Walk');
    await toggleCompletion(db, id, '2026-03-01');
    await toggleCompletion(db, id, '2026-03-05');
    expect(await completionDays(db, id, '2026-03-02')).toEqual(['2026-03-05']);
    await archiveHabit(db, id);
    expect(await listHabits(db)).toHaveLength(0);
  });
  it('counts weekly activity per day', async () => {
    const db = await makeDb();
    const id = await createHabit(db, 'Read');
    const days = lastDays(7, '2026-03-07');
    await toggleCompletion(db, id, days[6]);
    const act = await activityByDay(db, days);
    expect(act[days[6]].habits).toBe(1);
    expect(act[days[0]].habits).toBe(0);
  });
  it('date helpers work across month boundaries', () => {
    expect(addDays('2026-02-28', 1)).toBe('2026-03-01');
    expect(lastDays(3, '2026-03-01')).toEqual(['2026-02-27', '2026-02-28', '2026-03-01']);
  });
});
