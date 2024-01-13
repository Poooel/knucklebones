import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { Button } from './Button'
import { getPathWithoutLanguage, supportedLanguages } from '../translations'

function getNextLanguagePath(currentLanguage: string) {
  const currentIndex = supportedLanguages.findIndex(({ value }) =>
    currentLanguage.startsWith(value)
  )
  const nextLang = supportedLanguages[currentIndex === 0 ? 1 : 0].value
  return `/${nextLang}${getPathWithoutLanguage()}`
}

// https://ui.shadcn.com/docs/components/select ?
export function Language() {
  const { t, i18n } = useTranslation()
  const nextLanguagePath = getNextLanguagePath(i18n.language)

  return (
    <Button
      as='a'
      href={nextLanguagePath}
      variant='ghost'
      leftIcon={<GlobeAltIcon />}
    >
      {t('language')}
    </Button>
  )
}
