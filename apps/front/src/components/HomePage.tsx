import * as React from 'react'
import { Link } from 'react-router-dom'
import KnucklebonesLogo from '../svgs/logo.svg'
import { Button } from './Button'
import { Theme } from './Theme'
import { Disclaimer } from './Disclaimer'
import { CodeBracketIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { GameSettingsModal } from './GameSettings'
import { type PlayerType } from '@knucklebones/common'

export function HomePage() {
  const [playerType, setPlayerType] = React.useState<PlayerType>()
  const [isEditingGameSettings, setEditingGameSettings] = React.useState(false)

  function openGameSettings(playerType: PlayerType) {
    setEditingGameSettings(true)
    setPlayerType(playerType)
  }

  return (
    <>
      <div className='flex flex-col items-center justify-center gap-8'>
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
        <div className='flex flex-col gap-8'>
          <Button
            size='large'
            onClick={() => {
              openGameSettings('human')
            }}
          >
            Play against a friend
          </Button>
          <Button
            size='large'
            onClick={() => {
              openGameSettings('ai')
            }}
          >
            Play against an AI
          </Button>
          <Button as={Link} size='large' to='/how-to-play'>
            How to play
          </Button>
        </div>
        <div className='absolute bottom-0 flex flex-col gap-2 p-2'>
          <Disclaimer />
          <div className='flex flex-row justify-center gap-4'>
            <a
              className='text-slate-900 transition-all hover:text-slate-900/80 dark:text-slate-200 dark:hover:text-slate-50/80'
              href='https://github.com/Poooel/knucklebones'
              target='_blank'
              rel='noreferrer'
            >
              <div className='aspect-square h-6'>
                <CodeBracketIcon />
              </div>
            </a>
            <a
              className='text-slate-900 transition-all hover:text-slate-900/80 dark:text-slate-200 dark:hover:text-slate-50/80'
              href='mailto:contact@knucklebones.io'
              target='_blank'
              rel='noreferrer'
            >
              <div className='aspect-square h-6'>
                <EnvelopeIcon />
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className='fixed top-0 right-0 p-2 md:p-4'>
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
      </div>
    </>
  )
}
