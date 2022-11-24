import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import KnucklebonesLogo from '../svgs/logo.svg'
import { v4 as uuidv4 } from 'uuid'
import { init } from '../utils/api'

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div className='flex flex-col items-center justify-center gap-8 text-slate-900 transition-all dark:text-slate-200'>
      <div className='flex flex-row items-center gap-4'>
        <img
          src={KnucklebonesLogo}
          alt='Knucklebones Logo'
          className='aspect-square h-32'
        />
        <p className='font-[Mona-Sans] text-8xl font-bold tracking-tight'>
          Knucklebones
        </p>
      </div>
      <div className='flex flex-col gap-8'>
        <button
          className='rounded-md border-2 border-slate-300 bg-slate-200 p-4 text-4xl font-medium tracking-tight hover:bg-slate-200/70 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-700/70'
          onClick={() => navigate(`/room/${uuidv4()}`)}
        >
          Play against a friend
        </button>
        <button
          className='rounded-md border-2 border-slate-300 bg-slate-200 p-4 text-4xl font-medium tracking-tight hover:bg-slate-200/70 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-700/70'
          onClick={() => {
            const roomKey = uuidv4()
            navigate(`/room/${roomKey}`)
            setTimeout(() => {
              void init(roomKey, 'beep-boop', 'ai')
            }, 20)
          }}
        >
          Play against an AI
        </button>
      </div>
    </div>
  )
}
