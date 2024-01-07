import { DEFAULT_LANGUAGE, isLanguageSupported } from './resources'

const LANGUAGE_REGEX = /\/(\w+)\//i
const PATH_WITHOUT_LANGUAGE_REGEX = /\/(?:\w+)(.+)/i

export function getPathWithoutLanguage() {
  const [, path] =
    window.location.pathname.match(PATH_WITHOUT_LANGUAGE_REGEX) ?? []
  return path
}

export function getPathLanguage() {
  const [, lang] = window.location.pathname.match(LANGUAGE_REGEX) ?? []
  if (lang !== undefined && isLanguageSupported(lang)) {
    return lang
  }
}

export function getUserLanguage() {
  const userLang = navigator.language.split('-')[0]
  return isLanguageSupported(userLang) ? userLang : DEFAULT_LANGUAGE
}
