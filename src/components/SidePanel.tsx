import * as React from 'react'
import { clsx } from 'clsx'
import { Player } from '../utils/players'
import { Dice, DicePlaceholder } from './Dice'

interface SidePanelProps {
  nextDie: number | null
  playerBoard: Player
  totalScore: number
}

export function SidePanel({
  nextDie,
  playerBoard,
  totalScore
}: SidePanelProps) {
  return (
    <div
      className={clsx(
        'flex w-full items-center justify-between gap-2 md:flex-1 md:items-start md:justify-start md:gap-4',
        {
          'flex-row md:flex-col-reverse md:items-end':
            playerBoard === Player.PlayerTwo,
          'flex-row-reverse md:flex-col md:items-start':
            playerBoard === Player.PlayerOne
        }
      )}
    >
      {nextDie !== null ? <Dice value={nextDie} /> : <DicePlaceholder />}
      <p>Total: {totalScore}</p>
    </div>
  )
}
