import * as React from 'react'
import clsx from 'clsx'
import { Text } from '../Text'
import { PlayerOutcomeWithWins } from './history.utils'

interface PlayerHistoryDetailProps extends PlayerOutcomeWithWins {
  playerName: string
  didWin: boolean
  isRightSide?: boolean
}

export function PlayerHistoryDetail({
  didWin,
  playerName,
  score,
  wins,
  isRightSide = false
}: PlayerHistoryDetailProps) {
  return (
    <div
      className={clsx('flex gap-4', {
        'flex-row place-self-end': !isRightSide,
        'flex-row-reverse place-self-start': isRightSide,
        'font-semibold': didWin
      })}
    >
      <Text>{playerName}</Text>
      <div
        className={clsx('flex gap-2', {
          'flex-row': !isRightSide,
          'flex-row-reverse': isRightSide
        })}
      >
        <Text>({score})</Text>
        <Text>{wins}</Text>
      </div>
    </div>
  )
}
