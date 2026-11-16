import { create } from 'zustand';
import { getDb } from '../db/client';
import { allPrefs, setPref } from '../db/repos/prefs';
import { detectLang, type Lang } from '../i18n';

export type Theme = 'light' | 'dark';
export type Persisted = {
  language: Lang; theme: Theme; name: string; interests: string[]; devGoals: string[];
  values: string[]; notifications: boolean; onboarded: boolean;
};
export const defaultPrefs = (): Persisted => ({
  language: detectLang(), theme: 'light', name: '', interests: [], devGoals: [], values: [], notifications: false, onboarded: false,
});

type State = Persisted & {
  ready: boolean;
  error: string | null;
  init: () => Promise<void>;
  update: (patch: Partial<Persisted>) => void;
};

export const toggleIn = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

export const usePrefs = create<State>((set) => ({
  ...defaultPrefs(),
  ready: false,
  error: null,
  init: async () => {
    try {
      const db = await getDb();
      const saved = await allPrefs(db);
      const keys = Object.keys(defaultPrefs());
      const patch: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(saved)) {
        if (keys.includes(k)) {
          try { patch[k] = JSON.parse(v); } catch { /* ignore corrupt value */ }
        }
      }
      set({ ...(patch as Partial<Persisted>), ready: true, error: null });
    } catch (e) {
      set({ ready: true, error: String(e) });
    }
  },
  update: (patch) => {
    set(patch);
    getDb()
      .then((db) => Promise.all(Object.entries(patch).map(([k, v]) => setPref(db, k, JSON.stringify(v)))))
      .catch((e) => console.warn('Could not save preference', e));
  },
}));
