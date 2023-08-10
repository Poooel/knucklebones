import * as React from 'react'
import { Text } from '../Text'
import { PlayerHistoryDetail } from './PlayerHistoryDetail'
import { DetailedHistory } from './history.utils'
import { PlayerSide } from '../../utils/player'

interface HistoryDetailProps {
  detailedHistory: DetailedHistory
  playerOneName: string
  playerTwoName: string
  playerSide: PlayerSide
}

export function HistoryDetail({
  detailedHistory,
  playerOneName,
  playerTwoName,
  playerSide
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
      {[...detailedHistory]
        .reverse()
        .map(({ playerOne, playerTwo, outcome }, index) => {
          const [leftPlayerName, rightPlayerName] =
            playerSide === 'spectator' || playerSide === 'player-one'
              ? [playerOneName, playerTwoName]
              : [playerTwoName, playerOneName]

          return (
            <React.Fragment
              key={`${playerOne.wins}-${playerTwo.wins}-${outcome}`}
            >
              <PlayerHistoryDetail
                {...playerOne}
                playerName={leftPlayerName}
                didWin={outcome === 'player-one-win'}
              />
              <Text>-</Text>
              <PlayerHistoryDetail
                {...playerTwo}
                playerName={rightPlayerName}
                didWin={outcome === 'player-two-win'}
                isRightSide
              />
              {index < detailedHistory.length - 1 && (
                <div className='col-span-3 h-4 w-0.5 place-self-center bg-slate-300'></div>
              )}
            </React.Fragment>
          )
        })}
    </div>
  )
}
