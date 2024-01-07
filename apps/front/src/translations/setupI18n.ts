import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LANGUAGE, resources } from './resources'
import { getUserLanguage, getPathLanguage } from './language'

// https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
export function setupI18n() {
  const pathLanguage = getPathLanguage()
  const userLanguage = getUserLanguage()

  if (pathLanguage === undefined) {
    // Would be better to have a server side redirection
    // https://developers.cloudflare.com/rules/url-forwarding/
    window.location.assign(`/${userLanguage}/`)
  }

  void i18n.use(initReactI18next).init({
    resources,
    lng: pathLanguage,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false
    }
  })
}
