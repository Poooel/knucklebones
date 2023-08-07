import * as React from 'react'
import clsx from 'clsx'
import {
  IGameState,
  Outcome,
  OutcomeHistory as OutcomeHistoryType,
  OutcomeHistoryEntry
} from '@knucklebones/common'
import { PlayerSide } from '../utils/playerSide'
import { Button } from './Button'
import { ToolbarModal } from './ToolbarModal'
import { Modal } from './Modal'
import { Text } from './Text'
import { getName } from '../utils/name'

interface PlayerOutcome {
  wins: number
  score: number
}
interface DetailedHistoryEntry {
  playerOne: PlayerOutcome
  playerTwo: PlayerOutcome
  outcome: Outcome
}
type DetailedHistory = DetailedHistoryEntry[]

function getOutcome({
  playerOneScore,
  playerTwoScore
}: OutcomeHistoryEntry): Outcome {
  if (playerOneScore > playerTwoScore) {
    return 'player-one-win'
  }
  if (playerOneScore < playerTwoScore) {
    return 'player-two-win'
  }
  return 'tie'
}

function getHistory(outcomeHistory: OutcomeHistoryType) {
  return outcomeHistory.reduce<DetailedHistory>((acc, current) => {
    const { playerOneScore, playerTwoScore } = current
    const outcome = getOutcome(current)
    const { playerOne, playerTwo } = acc.at(-1) ?? {
      playerOne: {
        wins: 0,
        score: 0
      },
      playerTwo: {
        wins: 0,
        score: 0
      }
    }
    acc.push({
      playerOne: {
        wins: playerOne.wins + (outcome === 'player-one-win' ? 1 : 0),
        score: playerOneScore
      },
      playerTwo: {
        wins: playerTwo.wins + (outcome === 'player-two-win' ? 1 : 0),
        score: playerTwoScore
      },
      outcome
    })
    return acc
  }, [])
}

type ScoreDisplayProps = DetailedHistoryEntry & {
  playerSide: PlayerSide
}

function ScoreDisplay({ playerOne, playerTwo, playerSide }: ScoreDisplayProps) {
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

interface PlayerHistoryDetailProps extends PlayerOutcome {
  playerName: string
  didWin: boolean
  isRightSide?: boolean
}

function PlayerHistoryDetail({
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
      className='grid gap-x-2'
      style={{
        // Same size for the left and right columns, and fix size based on
        // content for the middle column
        gridTemplateColumns: 'minmax(0, 1fr) max-content minmax(0, 1fr)'
      }}
    >
      {detailedHistory.map(({ playerOne, playerTwo, outcome }, index) => (
        <React.Fragment key={`${playerOne.wins}-${playerTwo.wins}-${outcome}`}>
          <PlayerHistoryDetail
            {...playerOne}
            playerName={playerOneName}
            didWin={outcome === 'player-one-win'}
          />
          <Text>-</Text>
          <PlayerHistoryDetail
            {...playerTwo}
            playerName={playerTwoName}
            didWin={outcome === 'player-two-win'}
            isRightSide
          />
          {index < detailedHistory.length - 1 && (
            <div className='col-span-3 h-4 w-0.5 place-self-center bg-slate-300'></div>
          )}
        </React.Fragment>
      ))}
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

  const detailedHistory = getHistory(outcomeHistory)
  const lasGameOutcome = detailedHistory.at(-1)!
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
          <ScoreDisplay {...lasGameOutcome} playerSide={playerSide} />
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
