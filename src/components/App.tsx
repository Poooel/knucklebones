import * as React from 'react'
import { Board, useBoard } from './Board'

// Not needed
function getRandomValue(min = 0, max = 1) {
  return Math.round(Math.random() * (max - min) + min)
}
function getRandomDice() {
  return getRandomValue(1, 6)
}

export function App() {
  // Will go away once we communicate with Ably
  const [enemyDice, setEnemyDice] = React.useState(getRandomDice())
  const [dice, setDice] = React.useState(getRandomDice())

  const { columns: enemyColumns, addToColumn: addToEnemyColumn } = useBoard({
    onDicePlaced() {
      // Not needed for enemy
      setEnemyDice(getRandomDice())
    }
  })

  const { columns, addToColumn } = useBoard({
    onDicePlaced() {
      // When player has played
      setDice(getRandomDice())
    }
  })

  // Listen to messages for when the enemy has played, call `addToEnemyColumn`

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
      <Board readonly isEnemyBoard columns={enemyColumns} nextDie={enemyDice} />
      <Board
        columns={columns}
        onColumnClick={(colIndex) => addToColumn(colIndex, dice)}
        nextDie={dice}
      />
      <button
        className='absolute bottom-0 right-0 m-2 p-2'
        onClick={() => {
          addToEnemyColumn(getRandomValue(0, 2), enemyDice)
        }}
      >
        Simulate enemy play
      </button>
    </div>
  )
}
