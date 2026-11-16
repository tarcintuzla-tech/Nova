import fs from 'fs';
import path from 'path';
import { MODULES } from '../src/constants/modules';
import tr from '../src/i18n/locales/tr.json';

const root = path.join(__dirname, '..');
const exists = (p: string) => fs.existsSync(path.join(root, p));

describe('navigation structure', () => {
  it('has all tab screens, onboarding and the module route', () => {
    ['home', 'discover', 'progress', 'profile'].forEach((t) => expect(exists(`app/(tabs)/${t}.tsx`)).toBe(true));
    expect(exists('app/(tabs)/_layout.tsx')).toBe(true);
    expect(exists('app/onboarding/index.tsx')).toBe(true);
    expect(exists('app/module/[id].tsx')).toBe(true);
  });
  it('registers sections with labels for all six modules', () => {
    const registry = fs.readFileSync(path.join(root, 'src/modules/registry.tsx'), 'utf8');
    expect(MODULES).toHaveLength(6);
    MODULES.forEach((m) => {
      expect(registry).toContain(`${m.id}: [`);
      const sections = (tr.sections as Record<string, Record<string, string>>)[m.id];
      expect(Object.keys(sections).length).toBeGreaterThan(2);
      Object.keys(sections).forEach((s) => expect(registry).toContain(`id: '${s}'`));
    });
  });
});
