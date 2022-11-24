import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import KnucklebonesLogo from '../svgs/logo.svg'
import { Button } from './Button'

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div className='flex flex-col items-center justify-center gap-8'>
      <div className='flex flex-row items-center gap-4'>
        <img
          src={KnucklebonesLogo}
          alt='Knucklebones Logo'
          className='aspect-square h-32'
        />
        <h1 className='font-mona text-8xl font-bold tracking-tight'>
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
            const roomKey = uuidv4()
            navigate(`/room/${roomKey}`, { state: { playerType: 'ai' } })
          }}
        >
          Play against an AI
        </Button>
      </div>
    </div>
  )
}
