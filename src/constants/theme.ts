export type Palette = {
  bg: string; surface: string; text: string; muted: string; accent: string; onAccent: string;
  border: string; soft: string; hero: string; onHero: string; heroMuted: string; danger: string;
};
export const light: Palette = {
  bg: '#F5F3EA', surface: '#FFFFFF', text: '#26332C', muted: '#78847B', accent: '#294C3B', onAccent: '#F5F3EA',
  border: '#A8B9A1', soft: '#E3E9DF', hero: '#294C3B', onHero: '#F5F3EA', heroMuted: '#A8B9A1', danger: '#A84B3C',
};
export const dark: Palette = {
  bg: '#121815', surface: '#1C2620', text: '#EDEBE2', muted: '#9AA89E', accent: '#A8B9A1', onAccent: '#121815',
  border: '#33423A', soft: '#2A352F', hero: '#294C3B', onHero: '#F5F3EA', heroMuted: '#A8B9A1', danger: '#E08A7A',
};
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius = { md: 16, lg: 24, pill: 999 };
export const font = { title: 28, heading: 20, body: 16, small: 13 };
export const shadow = {
  shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2,
};
