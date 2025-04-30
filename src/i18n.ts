import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import i18nBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(i18nBackend)
  .init({
    detection: { caches: ['localStorage'], lookupLocalStorage: 'i18nextLng' },
    fallbackLng: localStorage.getItem('i18nextLng') || 'en',
    lng: localStorage.getItem('i18nextLng') || 'en',
    backend: {
      loadPath: `${window.location.origin}/api/i18n/${localStorage.getItem('i18nextLng') || navigator.language}/lang.json`,
      reloadInterval: false,
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: true },
  });

export default i18n;
