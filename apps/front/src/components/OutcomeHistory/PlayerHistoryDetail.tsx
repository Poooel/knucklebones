import { clsx } from 'clsx'
import { type PlayerOutcomeWithWins } from '@knucklebones/common'
import { Text } from '../Text'

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
      {/* Pas ouf sur téléphone pour les longs noms, et l'overflow marche pas à chaque fois, et le break-all rend dégueu */}
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
