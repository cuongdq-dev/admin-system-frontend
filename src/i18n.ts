import i18n from 'i18next';
import i18nBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const getCurrentHost = import.meta.env.VITE_API_URL + '/i18n/en';

i18n
  .use(i18nBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    interpolation: { escapeValue: false },
    backend: { loadPath: getCurrentHost },
  });

export default i18n;
