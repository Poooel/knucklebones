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
      <Board readonly isEnemyBoard columns={enemyColumns} />
      <Board
        columns={columns}
        onColumnClick={(colIndex) => addToColumn(colIndex, dice)}
      />
      <button
        className='absolute bottom-0 right-0 m-2 p-2'
        onClick={() => {
          addToEnemyColumn(getRandomValue(0, 2), enemyDice)
        }}
      >
        Play for enemy
      </button>
    </div>
  )
}
