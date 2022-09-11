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

connectToAbly()

export interface Params {
  roomKey: string
}

const roomName = 'knucklebones'

export function App() {
  const { roomKey } = useParams<keyof Params>() as Params
  const roomId = `${roomName}:${roomKey}`
  const [myDice, setMyDice] = React.useState<number | null>(getRandomDice())
  const [opponentDice, setOpponentDice] = React.useState<number | null>(null)
  const [gameState, setGameState] = React.useState(GameState.Ongoing)

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
      setMyDice(null)
      setOpponentDice(getRandomDice())
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
      setOpponentDice(null)
      setMyDice(getRandomDice())
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

  // From https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
  // Not great way to have a dynamic VH for mobile browsers that can expand and
  // collapse parts of their interface (e.g. the address bar). Should be fixed
  // once `svh` is more broadly implemented.
  // https://developer.mozilla.org/en-US/docs/Web/CSS/length#relative_length_units_based_on_viewport
  React.useEffect(() => {
    function listener() {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    listener() // Runs listener on initial mount
    window.addEventListener('resize', listener)
    return () => window.removeEventListener('resize', listener)
  }, [])

  return (
    <div
      className='h-screen bg-slate-200'
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <div className='flex flex-col items-center justify-between px-2 py-4 md:h-full md:p-8'>
        <Board
          isOpponentBoard
          columns={opponentColumns}
          name={opponentName}
          nextDie={opponentDice}
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
            myDice !== null && addToMyColumn(colIndex, myDice)
          }
          nextDie={myDice}
          canPlay={gameState === GameState.Ongoing && myTurn}
          name={myName}
        />
        {/* Disclaimer on landscape mode to avoid implementing difficult and useless design */}
        <div className='fixed inset-0 hidden h-screen bg-black/25 opacity-100 landscape:block lg:landscape:hidden'>
          <div className='flex h-full flex-row items-center justify-center'>
            {/* Could be using `dialog` with `backdrop:` but doesn't seem to work atm */}
            <div className='rounded bg-white p-4'>
              <p>This game has been thought for portrait mode only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
