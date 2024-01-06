import * as React from 'react'
import clsx from 'clsx'
import { type GameOutcome } from '@knucklebones/common'
import { type PlayerSide } from '../../utils/player'
import { Text } from '../Text'
import { type GameContext } from '../../hooks/useGame'

interface ScoreDisplayProps extends GameOutcome, Pick<GameContext, 'boType'> {
  playerSide: PlayerSide
}

export function ScoreDisplay({
  boType,
  playerOne,
  playerTwo,
  playerSide
}: ScoreDisplayProps) {
  const score = (
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

  if (boType === 'indefinite') {
    return <Text>{score}</Text>
  }

  const currentRound = Math.min(playerOne.wins + playerTwo.wins + 1, boType)

  return (
    <Text>
      Round {currentRound} of {boType} ({score})
    </Text>
  )
}
