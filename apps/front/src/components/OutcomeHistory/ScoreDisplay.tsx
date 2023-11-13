import * as React from 'react'
import clsx from 'clsx'
import { type PlayerSide } from '../../utils/player'
import { type GameOutcome } from './history.utils'
import { Text } from '../Text'

type ScoreDisplayProps = GameOutcome & {
  playerSide: PlayerSide
}

export function ScoreDisplay({
  playerOne,
  playerTwo,
  playerSide
}: ScoreDisplayProps) {
  return (
    <Text>
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
    </Text>
  )
}
