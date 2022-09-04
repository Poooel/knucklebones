import * as React from 'react'
import { clsx } from 'clsx'
import { Dice } from './Dice'

interface SidePanelProps {
  nextDie?: number
  isOpponentBoard: boolean
  name: string | null
  totalScore: number
}

export function SidePanel({
  nextDie,
  isOpponentBoard,
  name,
  totalScore
}: SidePanelProps) {
  return (
    <div
      className={clsx(
        'flex flex-1 items-center justify-between md:items-start md:justify-start md:gap-4',
        {
          'flex-row md:flex-col-reverse md:items-end': !isOpponentBoard,
          'flex-row-reverse md:flex-col md:items-start': isOpponentBoard
        }
      )}
    >
      {nextDie !== undefined && (
        <Dice value={nextDie} fullSize={false} className='h-12 md:h-16' />
      )}
      <p>Total: {totalScore}</p>
      {name != null ? (
        <p>
          {name} ({isOpponentBoard ? 'opponent' : 'you'})
        </p>
      ) : (
        <p>{isOpponentBoard ? 'Opponent' : 'You'}</p>
      )}
    </div>
  )
}
