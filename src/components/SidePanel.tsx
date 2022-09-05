import * as React from 'react'
import { clsx } from 'clsx'
import { Dice, DicePlaceholder } from './Dice'

interface SidePanelProps {
  nextDie: number | null
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
        'flex w-full items-center justify-between gap-2 md:flex-1 md:items-start md:justify-start md:gap-4',
        {
          'flex-row md:flex-col-reverse md:items-end': !isOpponentBoard,
          'flex-row-reverse md:flex-col md:items-start': isOpponentBoard
        }
      )}
    >
      {nextDie !== null ? <Dice value={nextDie} /> : <DicePlaceholder />}
      <p>Total: {totalScore}</p>
    </div>
  )
}
