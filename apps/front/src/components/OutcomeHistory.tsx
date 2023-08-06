import * as React from 'react'
import clsx from 'clsx'
import {
  IGameState,
  Outcome,
  OutcomeHistory as OutcomeHistoryType
} from '@knucklebones/common'
import { PlayerSide } from '../utils/playerSide'
import { Button } from './Button'
import { ToolbarModal } from './ToolbarModal'
import { Modal } from './Modal'
import { Text } from './Text'
import { getName } from '../utils/name'

type DetailedHistory = Array<{
  playerOneWins: number
  playerTwoWins: number
  outcome: Outcome
}>

function getHistory(outcomeHistory: OutcomeHistoryType) {
  return outcomeHistory.reduce<DetailedHistory>((acc, current) => {
    const { playerOneWins, playerTwoWins } = acc.at(-1) ?? {
      playerOneWins: 0,
      playerTwoWins: 0
    }
    acc.push({
      playerOneWins: playerOneWins + (current === 'player-one-win' ? 1 : 0),
      playerTwoWins: playerTwoWins + (current === 'player-two-win' ? 1 : 0),
      outcome: current
    })
    return acc
  }, [])
}

interface ScoreDisplayProps {
  playerOneScore: number
  playerTwoScore: number
  playerSide: PlayerSide
}

function ScoreDisplay({
  playerOneScore,
  playerTwoScore,
  playerSide
}: ScoreDisplayProps) {
  return (
    <>
      <span
        className={clsx({
          'font-semibold': playerSide === 'player-one'
        })}
      >
        {playerOneScore}
      </span>{' '}
      -{' '}
      <span
        className={clsx({
          'font-semibold': playerSide === 'player-two'
        })}
      >
        {playerTwoScore}
      </span>
    </>
  )
}

interface HistoryDetailProps {
  detailedHistory: DetailedHistory
  playerOneName: string
  playerTwoName: string
}

function HistoryDetail({
  detailedHistory,
  playerOneName,
  playerTwoName
}: HistoryDetailProps) {
  return (
    <div
      className='grid gap-x-4'
      style={{
        // Same size for the left and right columns, and fix size based on
        // content for the middle column
        gridTemplateColumns: 'minmax(0, 1fr) max-content minmax(0, 1fr)'
      }}
    >
      {detailedHistory.map(
        ({ playerOneWins, playerTwoWins, outcome }, index) => (
          <React.Fragment key={`${playerOneWins}-${playerTwoWins}-${outcome}`}>
            <Text className='place-self-end'>
              {outcome === 'player-one-win' && playerOneName}
            </Text>
            <Text className='place-self-center'>
              {playerOneWins} - {playerTwoWins}
            </Text>
            <Text className='place-self-start'>
              {outcome === 'player-two-win' && playerTwoName}
            </Text>
            {index < detailedHistory.length - 1 && (
              <div className='col-span-3 h-4 w-0.5 place-self-center bg-slate-300'></div>
            )}
          </React.Fragment>
        )
      )}
    </div>
  )
}

interface OutcomeHistoryProps
  extends Pick<IGameState, 'outcomeHistory' | 'playerOne' | 'playerTwo'> {
  playerSide: PlayerSide
}

export function OutcomeHistory({
  outcomeHistory,
  playerSide,
  playerOne,
  playerTwo
}: OutcomeHistoryProps) {
  if (outcomeHistory.length === 0) {
    return null
  }

  const playerOneScore = outcomeHistory.filter(
    (outcome) => outcome === 'player-one-win'
  ).length
  const playerTwoScore = outcomeHistory.filter(
    (outcome) => outcome === 'player-two-win'
  ).length
  const detailedHistory = getHistory(outcomeHistory)
  // These should come from gameState out of the box (either using Player class
  // but not great as React props, or parse them in useGame)
  // `inGameName` or something like that, should not be used in `<Name />`
  const playerOneName = playerSide === 'player-one' ? 'You' : getName(playerOne)
  const playerTwoName = playerSide === 'player-two' ? 'You' : getName(playerTwo)

  return (
    <ToolbarModal
      position='left'
      renderTrigger={({ onClick }) => (
        <Button variant='secondary' onClick={onClick}>
          <ScoreDisplay
            playerOneScore={playerOneScore}
            playerTwoScore={playerTwoScore}
            playerSide={playerSide}
          />
        </Button>
      )}
    >
      <Modal.Title>History</Modal.Title>
      <HistoryDetail
        detailedHistory={detailedHistory}
        playerOneName={playerOneName}
        playerTwoName={playerTwoName}
      />
    </ToolbarModal>
  )
}
