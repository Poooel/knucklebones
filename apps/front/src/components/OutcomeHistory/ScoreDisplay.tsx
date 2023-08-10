import * as React from 'react'
import clsx from 'clsx'
import { PlayerSide } from '../../utils/player'
import { GameOutcome } from './history.utils'

type ScoreDisplayProps = GameOutcome & {
  playerSide: PlayerSide
}

export function ScoreDisplay({
  playerOne,
  playerTwo,
  playerSide
}: ScoreDisplayProps) {
  return (
    <>
      <span
        className={clsx({
          'font-semibold': playerSide === 'player-one'
        })}
      >
        {playerOne.wins}
      </span>{' '}
      -{' '}
      <span
        className={clsx({
          'font-semibold': playerSide === 'player-two'
        })}
      >
        {playerTwo.wins}
      </span>
    </>
  )
}
