import { createI18n, type I18nOptions } from "vue-i18n";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import fr from "@/locales/fr.json";
// import en from "@/locales/en.json";

const defaultLocale = "fr";

dayjs.locale("fr");

const options: I18nOptions = {
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  warnHtmlMessage: false,
  messages: {
    fr: fr,
    // en: en,
  },
  datetimeFormats: {
    fr: {
      short: {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    },
    en: {
      short: {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    },
  },
  numberFormats: {
    fr: {
      currency: {
        style: "currency",
        currency: "EUR",
      },
    },
    en: {
      currency: {
        style: "currency",
        currency: "EUR",
      },
    },
  },
};

export const changeLocale = (locale: string) => {
  dayjs.locale(locale);
  document.documentElement.lang = locale;
};

const i18n = createI18n<false, typeof options>(options);

export default i18n;
