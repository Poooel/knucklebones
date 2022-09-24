import * as React from 'react'
import { Transition } from '@headlessui/react'
import { useBoard } from '../hooks/useBoard'
import { useTurn } from '../hooks/useTurn'
import { useNames } from '../hooks/useNames'
import { useGame, useResumeGame } from '../hooks/useGame'
import { getRandomDice } from '../../functions/utils/random'
import { connectToAbly } from '../utils/connectToAbly'
import { GameState } from '../utils/gameState'
import { whichPlayerWins } from '../utils/win'
import { getScore } from '../utils/score'
import { useDice } from '../hooks/useDice'
import { Player } from '../utils/players'
import { Board } from './Board'
import { Win } from './Win'

connectToAbly()

export interface Params {
  roomKey: string
}

export function App() {
  const [gameState, setGameState] = React.useState(GameState.Ongoing)
  const { playerOneDice, playerTwoDice, sendDice } = useDice(getRandomDice())

  function onBoardFull() {
    setGameState(
      whichPlayerWins(
        getScore(playerOneColumn).totalScore,
        getScore(playerTwoColumns).totalScore
      )
    )
  }

  const {
    columns: playerTwoColumns,
    addToColumn: addToPlayerTwoColumn,
    removeDiceFromColumn: removeDiceFromPlayerTwoColumn
  } = useBoard({ onBoardFull })

  const {
    columns: playerOneColumn,
    addToColumn: addToPlayerOneColumn,
    removeDiceFromColumn: removeDiceFromPlayerOneColumn
  } = useBoard({
    onBoardFull,
    onDicePlaced(column, value) {
      sendPlay({ column, value })
      removeDiceFromPlayerTwoColumn(column, value)
      sendDice(getRandomDice())
    }
  })

  const playerTurn = useTurn()
  const { playerOneName, playerTwoName } = useNames()
  const { sendPlay } = useGame({
    onPlayerTwoPlay({ column, value }) {
      addToPlayerTwoColumn(column, value)
      removeDiceFromPlayerOneColumn(column, value)
    }
  })

  useResumeGame({
    onPlayerOnePlay({ column, value }) {
      addToPlayerOneColumn(column, value, false)
      removeDiceFromPlayerTwoColumn(column, value)
    },
    onPlayerTwoPlay({ column, value }) {
      addToPlayerTwoColumn(column, value, false)
      removeDiceFromPlayerOneColumn(column, value)
    }
  })

  return (
    <div className='grid grid-cols-1 lg:grid lg:h-screen lg:place-content-center'>
      <div className='flex flex-col items-center justify-between gap-4 px-2 py-4 md:p-8'>
        <Board
          playerBoard={Player.PlayerTwo}
          columns={playerTwoColumns}
          name={playerTwoName}
          nextDie={playerTwoDice}
          canPlay={
            gameState === GameState.Ongoing && playerTurn === Player.PlayerTwo
          }
        />

        <Transition
          show={gameState !== GameState.Ongoing}
          className='transition duration-100 ease-in-out'
          enterFrom='opacity-0 scale-75'
          enterTo='opacity-100 scale-100'
          leaveFrom='opacity-100 scale-100'
          leaveTo='opacity-0 scale-75'
        >
          <Win
            playerTwoName={playerTwoName}
            gameState={gameState}
            playerOneScore={getScore(playerOneColumn)}
            playerTwoScore={getScore(playerTwoColumns)}
          />
        </Transition>
        {gameState === GameState.Ongoing && <p className='uppercase'>vs</p>}
        <Board
          playerBoard={Player.PlayerOne}
          columns={playerOneColumn}
          onColumnClick={(colIndex) =>
            gameState === GameState.Ongoing &&
            playerTurn === Player.PlayerOne &&
            addToPlayerOneColumn(colIndex, playerOneDice)
          }
          nextDie={playerOneDice}
          canPlay={
            gameState === GameState.Ongoing && playerTurn === Player.PlayerOne
          }
          name={playerOneName}
        />
      </div>
    </div>
  )
}
