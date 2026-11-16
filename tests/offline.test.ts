import fs from 'fs';
import path from 'path';

/** The app must work without network: no fetch/XHR/WebSocket in app code. */
const walk = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(e.name) ? [p] : [];
  });

describe('offline-first', () => {
  it('app code makes no network calls', () => {
    const root = path.join(__dirname, '..');
    [...walk(path.join(root, 'src')), ...walk(path.join(root, 'app'))].forEach((f) => {
      const s = fs.readFileSync(f, 'utf8');
      expect(s).not.toMatch(/\bfetch\(|XMLHttpRequest|WebSocket|axios/);
    });
  });
});
