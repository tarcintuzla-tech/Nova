import type { Lang } from '../i18n';
export type L = { tr: string; en: string };
export const l = (tr: string, en: string): L => ({ tr, en });
export const pick = (o: L, lang: Lang) => o[lang];
