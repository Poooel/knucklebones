import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LANGUAGE, resources } from './resources'
import { getPathLanguage } from './language'

// https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
export function setupI18n() {
  void i18n.use(initReactI18next).init({
    resources,
    lng: getPathLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false
    }
  })
}
