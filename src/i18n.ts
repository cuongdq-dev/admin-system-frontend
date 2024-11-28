import i18n from 'i18next';
import i18nBackend from 'i18next-http-backend';

const getCurrentHost = import.meta.env.VITE_API_URL + '/i18n/lang.json';

i18n.use(i18nBackend).init({
  fallbackLng: 'en',
  lng: 'en',
  debug: true,
  backend: { loadPath: getCurrentHost },
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
