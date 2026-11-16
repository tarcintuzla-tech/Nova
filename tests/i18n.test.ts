import tr from '../src/i18n/locales/tr.json';
import en from '../src/i18n/locales/en.json';

const flat = (o: Record<string, unknown>, p = ''): string[] =>
  Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' && v ? flat(v as Record<string, unknown>, `${p}${k}.`) : [`${p}${k}`]));

describe('translations', () => {
  it('Turkish and English have exactly the same keys', () => {
    expect(flat(tr).sort()).toEqual(flat(en).sort());
  });
  it('same placeholders in both languages', () => {
    const get = (o: Record<string, unknown>, k: string) => k.split('.').reduce<unknown>((a, p) => (a as Record<string, unknown>)[p], o) as string;
    flat(tr).forEach((k) => {
      const ph = (s: string) => (s.match(/{{\w+}}/g) ?? []).sort();
      expect(ph(get(en, k))).toEqual(ph(get(tr, k)));
    });
  });
});
