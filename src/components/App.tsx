import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useBoard } from '../hooks/useBoard'
import { useTurn } from '../hooks/useTurn'
import { useNames } from '../hooks/useNames'
import { useGame, useResumeGame } from '../hooks/useGame'
import { getRandomDice } from '../utils/random'
import { connectToAbly } from '../utils/connectToAbly'
import { Board } from './Board'
import { Win } from './Win'
import { GameState } from '../utils/gameState'
import { whichPlayerWins } from '../utils/win'
import { getScore } from '../utils/score'
import { useDice } from '../hooks/useDice'

connectToAbly()

export interface Params {
  roomKey: string
}

const roomName = 'knucklebones'

export function App() {
  const { roomKey } = useParams<keyof Params>() as Params
  const roomId = `${roomName}:${roomKey}`
  const [gameState, setGameState] = React.useState(GameState.Ongoing)
  const { playerOneDice, playerTwoDice, sendDice } = useDice(
    roomId,
    getRandomDice()
  )

  const {
    columns: opponentColumns,
    addToColumn: addToOpponentColumn,
    removeDiceFromColumn: removeDiceFromOpponentColumn
  } = useBoard({
    onBoardFull() {
      setGameState(
        whichPlayerWins(
          getScore(myColumns).totalScore,
          getScore(opponentColumns).totalScore
        )
      )
    }
  })

  const {
    columns: myColumns,
    addToColumn: addToMyColumn,
    removeDiceFromColumn: removeDiceFromMyColumn
  } = useBoard({
    onDicePlaced(column, value) {
      sendPlay({ column, value })
      removeDiceFromOpponentColumn(column, value)
      sendDice(getRandomDice())
    },
    onBoardFull() {
      setGameState(
        whichPlayerWins(
          getScore(myColumns).totalScore,
          getScore(opponentColumns).totalScore
        )
      )
    }
  })

  const myTurn = useTurn(roomId)
  const { myName, opponentName } = useNames(roomId)
  const { sendPlay } = useGame(roomId, {
    onOpponentPlay({ column, value }) {
      addToOpponentColumn(column, value)
      removeDiceFromMyColumn(column, value)
    }
  })

  useResumeGame(roomId, {
    onMyPlay({ column, value }) {
      addToMyColumn(column, value, false)
      removeDiceFromOpponentColumn(column, value)
    },
    onOpponentPlay({ column, value }) {
      addToOpponentColumn(column, value, false)
      removeDiceFromMyColumn(column, value)
    }
  })

  return (
    <div className='lg:grid lg:h-screen lg:place-content-center'>
      <div className='flex flex-col items-center justify-between gap-4 px-2 py-4 md:p-8'>
        <Board
          isOpponentBoard
          columns={opponentColumns}
          name={opponentName}
          nextDie={playerTwoDice}
          canPlay={gameState === GameState.Ongoing && !myTurn}
        />
        {gameState !== GameState.Ongoing ? (
          <Win
            playerTwoName={opponentName}
            gameState={gameState}
            playerOneScore={getScore(myColumns)}
            playerTwoScore={getScore(opponentColumns)}
          />
        ) : (
          <p className='uppercase'>vs</p>
        )}
        <Board
          columns={myColumns}
          onColumnClick={(colIndex) =>
            gameState === GameState.Ongoing &&
            myTurn &&
            addToMyColumn(colIndex, playerOneDice)
          }
          nextDie={playerOneDice}
          canPlay={gameState === GameState.Ongoing && myTurn}
          name={myName}
        />
      </div>
    </div>
  )
}
