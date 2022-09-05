import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useBoard } from '../hooks/useBoard'
import { useTurn } from '../hooks/useTurn'
import { useNames } from '../hooks/useNames'
import { useGame, useResumeGame } from '../hooks/useGame'
import { getRandomDice } from '../utils/random'
import { connectToAbly } from '../utils/connectToAbly'
import { Board } from './Board'

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

  const {
    columns: opponentColumns,
    addToColumn: addToOpponentColumn,
    removeDiceFromColumn: removeDiceFromOpponentColumn
  } = useBoard()
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

  return (
    <div className='flex h-screen flex-col items-center justify-between bg-slate-200 p-6'>
      <Board
        isOpponentBoard
        columns={opponentColumns}
        name={opponentName}
        nextDie={opponentDice}
        canPlay={!myTurn}
      />
      <p className='uppercase'>vs</p>
      <Board
        columns={myColumns}
        onColumnClick={(colIndex) =>
          myDice !== null && addToMyColumn(colIndex, myDice)
        }
        nextDie={myDice}
        canPlay={myTurn}
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
  )
}
