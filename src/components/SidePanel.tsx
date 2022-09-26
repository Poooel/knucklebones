import * as React from 'react'
import { clsx } from 'clsx'
import { Dice, DicePlaceholder } from './Dice'

interface SidePanelProps {
  nextDice: number | null
  isPlayerOne: boolean
  totalScore: number
}

export function SidePanel({
  nextDice,
  isPlayerOne,
  totalScore
}: SidePanelProps) {
  return (
    <div
      className={clsx(
        'flex w-full items-center justify-between gap-2 md:flex-1 md:items-start md:justify-start md:gap-4',
        {
          'flex-row md:flex-col-reverse md:items-end': !isPlayerOne,
          'flex-row-reverse md:flex-col md:items-start': isPlayerOne
        }
      )}
    >
      {nextDice !== null ? <Dice value={nextDice} /> : <DicePlaceholder />}
      <p>Total: {totalScore}</p>
    </div>
  )
}
