import { textSchema, nameSchema } from '../src/utils/validation';

describe('input validation', () => {
  it('rejects empty and whitespace-only text', () => {
    expect(textSchema(10).safeParse({ value: '   ' }).success).toBe(false);
  });
  it('accepts text and trims it', () => {
    const r = textSchema(10).safeParse({ value: ' hi ' });
    expect(r.success && r.data.value).toBe('hi');
  });
  it('rejects text that is too long', () => {
    const r = textSchema(3).safeParse({ value: 'abcd' });
    expect(r.success).toBe(false);
  });
  it('allows empty text when optional', () => {
    expect(textSchema(10, true).safeParse({ value: '' }).success).toBe(true);
  });
  it('limits names to 40 characters', () => {
    expect(nameSchema.safeParse('a'.repeat(41)).success).toBe(false);
  });
});
