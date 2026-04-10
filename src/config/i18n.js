import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enTranslations from "./locales/en/translation.json"
import deTranslations from "./locales/de/translation.json";

i18n.use(initReactI18next).use(LanguageDetector).init({
    resources: {
        de: { translation: deTranslations },
        en: { translation: enTranslations },
    },
    defaultNS: 'translation',
    fallbackLng: 'de',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;