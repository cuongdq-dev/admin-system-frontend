import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import vn from './locales/vi.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, vn: { translation: vn } },
    detection: { caches: ['localStorage'], lookupLocalStorage: 'i18nextLng' },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    react: { useSuspense: true },
  });

export default i18n;
