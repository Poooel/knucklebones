import * as React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from './Button'
import { Theme } from './Theme'
import { GameSettingsModal } from './GameSettings'
import KnucklebonesLogo from '../svgs/logo.svg'
import { type PlayerType } from '@knucklebones/common'
import { Footer } from './Footer'
import { Language } from './Language'

export function HomePage() {
  const [playerType, setPlayerType] = React.useState<PlayerType>()
  const [isEditingGameSettings, setEditingGameSettings] = React.useState(false)
  const { t } = useTranslation()

  function openGameSettings(playerType: PlayerType) {
    setEditingGameSettings(true)
    setPlayerType(playerType)
  }

  return (
    <>
      <div className='flex flex-col items-center justify-center gap-4 md:gap-8 m-4'>
        <div className='flex flex-row items-center gap-2 md:gap-4'>
          <img
            src={KnucklebonesLogo}
            alt='Knucklebones Logo'
            className='aspect-square h-16 md:h-32'
          />
          <h1 className='font-mona text-4xl font-bold tracking-tight md:text-8xl'>
            Knucklebones
          </h1>
        </div>
        <p className='text-base md:text-xl text-center max-w-sm md:max-w-xl'>
          {t('home.description')}
        </p>
        <div className='flex flex-col gap-4 md:gap-8'>
          <Button
            size='large'
            onClick={() => {
              openGameSettings('human')
            }}
          >
            {t('home.play.friend')}
          </Button>
          <Button
            size='large'
            onClick={() => {
              openGameSettings('ai')
            }}
          >
            {t('home.play.ai')}
          </Button>
          <Button as={Link} size='large' to='/how-to-play'>
            {t('guide.label')}
          </Button>
        </div>
        <div className='absolute bottom-0 flex flex-col gap-2 p-2'>
          <Footer />
        </div>
      </div>
      <div className='fixed top-0 left-0 p-2 md:p-4'>
        <GameSettingsModal
          isOpen={isEditingGameSettings}
          playerType={playerType}
          onClose={() => {
            setEditingGameSettings(false)
          }}
          onAfterClose={() => {
            setPlayerType(undefined)
          }}
        />
        <Theme />
        <Language />
      </div>
    </>
  )
}
