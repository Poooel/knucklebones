import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { Button } from './Button'
import { saveUserLanguage, supportedLanguages } from '../translations'

function getNextLanguage(currentLanguage: string) {
  const currentIndex = supportedLanguages.findIndex(({ value }) =>
    currentLanguage.startsWith(value)
  )
  return supportedLanguages[currentIndex === 0 ? 1 : 0].value
}

// https://ui.shadcn.com/docs/components/select ?
export function Language() {
  const { t, i18n } = useTranslation()

  function changeLanguage() {
    const nextLanguage = getNextLanguage(i18n.language)
    saveUserLanguage(nextLanguage)
    void i18n.changeLanguage(nextLanguage)
  }

  return (
    <Button
      variant='ghost'
      leftIcon={<GlobeAltIcon />}
      onClick={changeLanguage}
    >
      {t('language')}
    </Button>
  )
}
