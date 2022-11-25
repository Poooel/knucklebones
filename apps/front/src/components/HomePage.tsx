import { Transition } from '@headlessui/react'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import KnucklebonesLogo from '../svgs/logo.svg'
import { Button } from './Button'

export function HomePage() {
  const navigate = useNavigate()
  const [showAiDifficulty, setShowAiDifficulty] = React.useState(false)

  return (
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
          variant='large'
          className='tracking-tight'
          onClick={() => navigate(`/room/${uuidv4()}`)}
        >
          Play against a friend
        </Button>
        <Button
          variant='large'
          className='tracking-tight'
          onClick={() => {
            setShowAiDifficulty(!showAiDifficulty)
          }}
        >
          Play against an AI
        </Button>
      </div>
      <Transition
        show={showAiDifficulty}
        enter='transition ease-in-out duration-300 transform'
        enterFrom='opacity-0 translate-y-8'
        enterTo='opacity-100 translate-y-0'
        leave='transition ease-in-out duration-300 transform'
        leaveFrom='opacity-100 translate-y-0'
        leaveTo='opacity-0 translate-y-8'
      >
        <div className='flex flex-row gap-4'>
          <Button
            variant='medium'
            className='tracking-tight'
            onClick={() =>
              navigate(`/room/${uuidv4()}`, {
                state: { playerType: 'ai', difficulty: 'easy' }
              })
            }
          >
            Easy
          </Button>
          <Button
            variant='medium'
            className='tracking-tight'
            onClick={() =>
              navigate(`/room/${uuidv4()}`, {
                state: { playerType: 'ai', difficulty: 'medium' }
              })
            }
          >
            Medium
          </Button>
          <Button
            variant='medium'
            className='tracking-tight'
            onClick={() =>
              navigate(`/room/${uuidv4()}`, {
                state: { playerType: 'ai', difficulty: 'hard' }
              })
            }
          >
            Hard
          </Button>
        </div>
      </Transition>
    </div>
  )
}
