import en from './en.json'
import fr from './fr.json'

export const resources = {
  en: {
    translation: en
  },
  fr: {
    translation: fr
  }
} as const

export const supportedLanguages = Object.entries(resources).map(
  ([lang, resource]) => ({
    value: lang,
    label: resource.translation.language
  })
)
