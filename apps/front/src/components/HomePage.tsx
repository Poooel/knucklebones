import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import KnucklebonesLogo from '../svgs/logo.svg'
import { v4 as uuidv4 } from 'uuid'
import { init } from '../utils/api'
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
        <p className='font-[Mona Sans] text-8xl font-bold tracking-tight'>
          Knucklebones
        </p>
      </div>
      <div className='flex flex-col gap-8 text-4xl'>
        <Button onClick={() => navigate(`/room/${uuidv4()}`)}>
          Play against a friend
        </Button>
        <Button
          onClick={() => {
            const roomKey = uuidv4()
            navigate(`/room/${roomKey}`)
            setTimeout(() => {
              void init(roomKey, 'beep-boop', 'ai')
            }, 20)
          }}
        >
          Play against an AI
        </Button>
      </div>
    </div>
  )
}