import * as React from 'react'
import { useTurn } from '../hooks/useTurn'
import { useNames } from '../hooks/useNames'
import { useGame, useResumeGame } from '../hooks/useGame'
import { getRandomDice } from '../utils/random'
import { connectToGame } from '../utils/game'
import { Board, useBoard } from './Board'
import { useParams } from 'react-router-dom'

connectToGame()

export interface Params {
  roomKey: string
}

const roomName = 'knucklebones'

export function App() {
  const { roomKey } = useParams<keyof Params>() as Params
  const roomId = `${roomName}:${roomKey}`

  const [dice, setDice] = React.useState(getRandomDice())

  const { columns: opponentColumns, addToColumn: addToOpponentColumn } =
    useBoard()
  const { columns, addToColumn } = useBoard({
    onDicePlaced(column, value) {
      sendPlay({ column, value })
      setDice(getRandomDice())
    }
  })

  const { sendPlay } = useGame(roomId, {
    onOpponentPlay({ column, value }) {
      addToOpponentColumn(column, value)
    }
  })
  const myTurn = useTurn(roomId)
  const { myName, opponentName } = useNames(roomId)
  useResumeGame(roomId, {
    onMyPlay({ column, value }) {
      addToColumn(column, value, false)
    },
    onOpponentPlay({ column, value }) {
      addToOpponentColumn(column, value, false)
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
        columns={columns}
        onColumnClick={(colIndex) => addToColumn(colIndex, dice)}
        nextDie={dice}
        canPlay={myTurn}
        name={myName}
      />
    </div>
  )
}
