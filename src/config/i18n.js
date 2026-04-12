import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enTranslations from "./locales/en/translation.json"
import deTranslations from "./locales/de/translation.json";
import frTranslations from "./locales/fr/translation.json";
import esTranslations from "./locales/es/translation.json";

i18n.use(initReactI18next).use(LanguageDetector).init({
    resources: {
        de: { translation: deTranslations },
        en: { translation: enTranslations },
        fr: { translation: frTranslations },
        es: { translation: esTranslations },
    },
    defaultNS: 'translation',
    fallbackLng: 'de',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;