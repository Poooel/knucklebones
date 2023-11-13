import * as React from 'react'
import { RectangleStackIcon } from '@heroicons/react/24/outline'
import { type GameContext } from '../../hooks/useGame'
import { Modal } from '../Modal'
import { Text } from '../Text'
import { ShortcutModal } from '../ShortcutModal'
import { getHistory } from './history.utils'
import { getLeadMessage } from './leadMessage.utils'
import { HistoryDetail } from './HistoryDetail'
import { ScoreDisplay } from './ScoreDisplay'

interface OutcomeHistoryProps
  extends Pick<
    GameContext,
    'outcomeHistory' | 'playerOne' | 'playerTwo' | 'playerSide'
  > {}

export function OutcomeHistory({
  outcomeHistory,
  playerSide,
  playerOne,
  playerTwo
}: OutcomeHistoryProps) {
  if (outcomeHistory.length === 0) {
    return null
  }

  const detailedHistory = getHistory(outcomeHistory)
  const lasGameOutcome = detailedHistory.at(-1)!

  return (
    <ShortcutModal
      icon={<RectangleStackIcon />}
      label={<ScoreDisplay {...lasGameOutcome} playerSide={playerSide} />}
    >
      <Modal.Title>History</Modal.Title>
      <div className='grid grid-cols-1 gap-2'>
        <Text className='text-center'>
          {getLeadMessage({
            gameOutcome: lasGameOutcome,
            playerOne,
            playerTwo
          })}
        </Text>
        <HistoryDetail
          detailedHistory={detailedHistory}
          playerOne={playerOne}
          playerTwo={playerTwo}
        />
      </div>
    </ShortcutModal>
  )
}
