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
  const [dice, setDice] = React.useState(getRandomDice())

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
      setDice(getRandomDice())
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
    <div className='flex h-screen flex-col items-center justify-between p-6'>
      {/* Disclaimer on landscape mode to avoid implementing difficult and useless design */}
      <div className='absolute inset-0 hidden h-screen bg-black/25 landscape:block lg:landscape:hidden'>
        <div className='flex h-full flex-row items-center justify-center'>
          {/* Could be using `dialog` with `backdrop:` but doesn't seem to work atm */}
          <div className='rounded bg-white p-4'>
            <p>This game has been thought for portrait mode only</p>
          </div>
        </div>
      </div>
      <Board isOpponentBoard columns={opponentColumns} name={opponentName} />
      <Board
        columns={myColumns}
        onColumnClick={(colIndex) => addToMyColumn(colIndex, dice)}
        nextDie={dice}
        canPlay={myTurn}
        name={myName}
      />
    </div>
  )
}
