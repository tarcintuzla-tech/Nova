import { makeDb } from './helpers';
import { createGoal, createTask, deleteGoal, deleteTask, listGoals, listTasks, toggleGoal, toggleTask } from '../src/db/repos/goals';

describe('goals and tasks', () => {
  it('creates, completes, reopens and deletes goals', async () => {
    const db = await makeDb();
    const id = await createGoal(db, 'Read 10 books');
    expect(await toggleGoal(db, id)).toBe(true);
    expect((await listGoals(db))[0].completed_at).not.toBeNull();
    expect(await toggleGoal(db, id)).toBe(false);
    await deleteGoal(db, id);
    expect(await listGoals(db)).toEqual([]);
  });
  it('manages tasks per day', async () => {
    const db = await makeDb();
    const id = await createTask(db, 'Call', '2026-04-01');
    await createTask(db, 'Other day', '2026-04-02');
    await toggleTask(db, id);
    const today = await listTasks(db, '2026-04-01');
    expect(today).toHaveLength(1);
    expect(today[0].done).toBe(1);
    await deleteTask(db, id);
    expect(await listTasks(db, '2026-04-01')).toEqual([]);
  });
});
