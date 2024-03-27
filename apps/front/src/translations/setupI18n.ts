import { initReactI18next } from 'react-i18next'
import { use } from 'i18next'
import { getPathLanguage } from './language'
import { DEFAULT_LANGUAGE, resources } from './resources'

// https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
export function setupI18n() {
  void use(initReactI18next).init({
    resources,
    lng: getPathLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false
    }
  })
}
