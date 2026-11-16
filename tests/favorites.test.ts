import { makeDb } from './helpers';
import { listFavoriteIds, listHistory, markRead, toggleFavorite } from '../src/db/repos/favorites';
import { doneOnDay, listKindness, markKindness, unmarkKindness } from '../src/db/repos/kindness';
import { saveQuiz, totals } from '../src/db/repos/stats';

describe('favorites, history, kindness', () => {
  it('toggles favorites', async () => {
    const db = await makeDb();
    expect(await toggleFavorite(db, 'l-octopus')).toBe(true);
    expect(await listFavoriteIds(db)).toEqual(['l-octopus']);
    expect(await toggleFavorite(db, 'l-octopus')).toBe(false);
    expect(await listFavoriteIds(db)).toEqual([]);
  });
  it('keeps reading history grouped by content', async () => {
    const db = await makeDb();
    await markRead(db, 'l-dna');
    await markRead(db, 'l-dna');
    await markRead(db, 'l-web');
    expect(await listHistory(db)).toHaveLength(2);
    expect((await totals(db)).reads).toBe(2);
  });
  it('tracks kindness once per activity per day', async () => {
    const db = await makeDb();
    await markKindness(db, 'k-thanks', '2026-05-01');
    await markKindness(db, 'k-thanks', '2026-05-01');
    expect(await doneOnDay(db, '2026-05-01')).toEqual(['k-thanks']);
    expect(await listKindness(db)).toHaveLength(1);
    await unmarkKindness(db, 'k-thanks', '2026-05-01');
    expect(await listKindness(db)).toEqual([]);
  });
  it('saves quiz results', async () => {
    const db = await makeDb();
    await saveQuiz(db, 'learning', 5, 8);
    expect((await totals(db)).quizzes).toBe(1);
  });
});
