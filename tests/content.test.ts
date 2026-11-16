import { ALL_CARDS, LEARNING_CATEGORIES, PEOPLE_CATEGORIES } from '../src/content/cards';
import { QUIZ } from '../src/content/quizzes';
import { EXERCISES, THOUGHTS } from '../src/content/awareness';
import { ACTIVITIES } from '../src/content/kindness';
import { SCENARIOS, PEOPLE_PROMPTS } from '../src/content/people';
import { QUESTIONS } from '../src/content/questions';
import { VALUES, STRENGTH_PROMPTS } from '../src/content/values';
import type { L } from '../src/content/helpers';

const texts: L[] = [
  ...ALL_CARDS.flatMap((c) => [c.title, c.body]), ...QUIZ.flatMap((q) => [q.q, q.explain, ...q.options]),
  ...EXERCISES.flatMap((e) => [e.title, e.body]), ...THOUGHTS, ...ACTIVITIES.flatMap((a) => [a.title, a.body]),
  ...SCENARIOS.flatMap((s) => [s.text, ...s.options.flatMap((o) => [o.text, o.note])]), ...PEOPLE_PROMPTS.map((p) => p.text),
  ...QUESTIONS, ...VALUES.map((v) => v.label), ...STRENGTH_PROMPTS.map((s) => s.text),
];

describe('bundled content (works fully offline)', () => {
  it('has Turkish and English text everywhere', () => {
    texts.forEach((t) => { expect(t.tr.length).toBeGreaterThan(1); expect(t.en.length).toBeGreaterThan(1); });
  });
  it('has unique ids', () => {
    const ids = [...ALL_CARDS.map((c) => c.id), ...QUIZ.map((q) => q.id), ...EXERCISES.map((e) => e.id), ...ACTIVITIES.map((a) => a.id)];
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('labels every card as fact or interpretation with a known category', () => {
    ALL_CARDS.forEach((c) => {
      expect(['fact', 'interpretation']).toContain(c.kind);
      expect([...LEARNING_CATEGORIES, ...PEOPLE_CATEGORIES]).toContain(c.category);
    });
  });
  it('quiz answers point at an existing option', () => {
    QUIZ.forEach((q) => { expect(q.answer).toBeGreaterThanOrEqual(0); expect(q.answer).toBeLessThan(q.options.length); });
  });
  it('body-language content is never labelled as certain fact', () => {
    ALL_CARDS.filter((c) => c.category === 'body').forEach((c) => expect(c.kind).toBe('interpretation'));
  });
});
