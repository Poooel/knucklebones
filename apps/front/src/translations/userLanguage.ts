import { supportedLanguages } from './resources'

const PREFERRED_LANGUAGE_KEY = 'preferred-language'

export function saveUserLanguage(lang: string) {
  localStorage.setItem(PREFERRED_LANGUAGE_KEY, lang)
}

export function getUserLanguage() {
  const localStorageEntry = localStorage.getItem(PREFERRED_LANGUAGE_KEY)
  if (
    localStorageEntry !== null &&
    supportedLanguages.some(({ value }) => localStorageEntry === value)
  ) {
    return localStorageEntry
  }
  return navigator.language
}
