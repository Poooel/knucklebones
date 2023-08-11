import * as React from 'react'
import { Text } from '../Text'
import { PlayerHistoryDetail } from './PlayerHistoryDetail'
import { DetailedHistory } from './history.utils'
import { getPlayerFromId } from '../../utils/player'
import { GameContext } from '../../hooks/useGame'

interface HistoryDetailProps
  extends Pick<GameContext, 'playerOne' | 'playerTwo'> {
  detailedHistory: DetailedHistory
}

export function HistoryDetail({
  detailedHistory,
  ...players
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
      {[...detailedHistory].reverse().map(({ playerOne, playerTwo }, index) => {
        const leftPlayer = getPlayerFromId(playerOne.id, players)
        const rightPlayer = getPlayerFromId(playerTwo.id, players)

        return (
          <React.Fragment
            key={`${playerOne.wins}-${playerTwo.wins}-${
              playerOne.score === playerTwo.score
            }`}
          >
            <PlayerHistoryDetail
              {...playerOne}
              playerName={leftPlayer.inGameName}
              didWin={playerOne.score > playerTwo.score}
            />
            <Text>-</Text>
            <PlayerHistoryDetail
              {...playerTwo}
              playerName={rightPlayer.inGameName}
              didWin={playerTwo.score > playerOne.score}
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
