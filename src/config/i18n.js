import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from "./locales/en/translation.json"
import deTranslations from "./locales/de/translation.json";

i18n.use(initReactI18next).init({
    resources: {
        de: { translation: deTranslations },
        en: { translation: enTranslations },
    },
    lng: 'de',
    fallbackLng: 'de',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;