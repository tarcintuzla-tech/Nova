import { dark, light, type Palette } from '../constants/theme';
import { usePrefs } from '../store/preferences';

export function useColors(): Palette {
  return usePrefs((s) => s.theme) === 'dark' ? dark : light;
}
