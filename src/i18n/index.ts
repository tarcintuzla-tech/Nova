import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import { getLocales } from 'expo-localization';
import tr from './locales/tr.json';
import en from './locales/en.json';

export type Lang = 'tr' | 'en';
export const toLang = (s: string | undefined): Lang => (s && s.startsWith('tr') ? 'tr' : 'en');
export const detectLang = (): Lang => toLang(getLocales()[0]?.languageCode ?? undefined);
export const useLang = (): Lang => toLang(useTranslation().i18n.language);

i18n.use(initReactI18next).init({
  resources: { tr: { translation: tr }, en: { translation: en } },
  lng: detectLang(),
  fallbackLng: 'tr',
  interpolation: { escapeValue: false },
});
export default i18n;
