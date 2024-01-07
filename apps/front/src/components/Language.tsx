import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { Button } from './Button'
import { supportedLanguages } from '../translations'

function getNextLanguage(currentLanguage: string) {
  const currentIndex = supportedLanguages.findIndex(({ value }) =>
    currentLanguage.startsWith(value)
  )
  return supportedLanguages[currentIndex === 0 ? 1 : 0].value
}

// https://ui.shadcn.com/docs/components/select ?
export function Language() {
  const { t, i18n } = useTranslation()
  const nextLanguage = getNextLanguage(i18n.language)

  return (
    <Button
      as='a'
      href={`/${nextLanguage}/`}
      variant='ghost'
      leftIcon={<GlobeAltIcon />}
    >
      {t('language')}
    </Button>
  )
}
