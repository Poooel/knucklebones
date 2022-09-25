import * as React from 'react'
import { useGame } from '../hooks/useGame'
import { Board } from './Board'
import { GameOutcome } from './GameOutcome'

export function App() {
  const { gameState, playerOne, playerTwo, isLoading, sendPlay } = useGame()

  if (
    gameState === null ||
    playerOne === undefined ||
    playerTwo === undefined
  ) {
    return <p>Loading</p>
  }

  const { gameOutcome, nextPlayer } = gameState

  const canPlay = !isLoading && gameOutcome === 'ongoing'
  const canPlayerOnePlay = canPlay && nextPlayer === playerOne.id
  const canPlayerTwoPlay = canPlay && nextPlayer === playerTwo.id

  return (
    <div className='grid grid-cols-1 lg:grid lg:h-screen lg:place-content-center'>
      <div className='flex flex-col items-center justify-between gap-4 px-2 py-4 md:p-8'>
        <Board {...playerTwo} isPlayerOne={false} canPlay={canPlayerTwoPlay} />
        <GameOutcome {...gameState} clientId={playerOne.id} />
        <Board
          {...playerOne}
          isPlayerOne
          onColumnClick={canPlayerOnePlay ? sendPlay : undefined}
          canPlay={canPlayerOnePlay}
        />
      </div>
    </div>
  )
}
