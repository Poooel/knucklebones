import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from './resources'
import { getUserLanguage } from './userLanguage'

export function setupTranslations() {
  void i18n.use(initReactI18next).init({
    resources,
    lng: getUserLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })
}
