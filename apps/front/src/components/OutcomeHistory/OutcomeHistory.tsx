import * as React from 'react'
import { GameContext } from '../../hooks/useGame'
import { Button } from '../Button'
import { Modal } from '../Modal'
import { Text } from '../Text'
import { ToolbarModal } from '../ToolbarModal'
import { ScoreDisplay } from './ScoreDisplay'
import { HistoryDetail } from './HistoryDetail'
import { getHistory } from './history.utils'
import { getLeadMessage } from './leadMessage.utils'

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
    <ToolbarModal
      position='left'
      renderTrigger={({ onClick }) => (
        <Button variant='secondary' onClick={onClick}>
          <ScoreDisplay {...lasGameOutcome} playerSide={playerSide} />
        </Button>
      )}
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
    </ToolbarModal>
  )
}
