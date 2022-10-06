import * as React from 'react'
import { useGame } from '../hooks/useGame'
import { Board } from './Board'
import { GameOutcome } from './GameOutcome'
import { Loading } from './Loading'
import { WarningToast } from './WarningToast'

export function App() {
  const {
    gameState,
    playerOne,
    playerTwo,
    isLoading,
    sendPlay,
    errorMessage,
    clearErrorMessage,
    sendRematch,
    updateDisplayName
  } = useGame()

  if (gameState === null || playerOne === undefined) {
    return <Loading />
  }

  const { gameOutcome, nextPlayer } = gameState

  const canPlay = !isLoading && gameOutcome === 'ongoing'
  const canPlayerOnePlay = canPlay && nextPlayer === playerOne?.id
  const canPlayerTwoPlay = canPlay && nextPlayer === playerTwo?.id

  return (
    <div className='flex flex-col items-center justify-between gap-12 px-2 py-4 md:p-8'>
      <Board
        {...playerTwo}
        isPlayerOne={false}
        canPlay={canPlayerTwoPlay}
        isDisplayNameEditable={false}
      />
      <GameOutcome
        {...gameState}
        clientId={playerOne.id}
        onRematch={() => {
          void sendRematch()
        }}
      />
      <Board
        {...playerOne}
        isPlayerOne
        onColumnClick={canPlayerOnePlay ? sendPlay : undefined}
        canPlay={canPlayerOnePlay}
        isDisplayNameEditable={true}
        updateDisplayName={updateDisplayName}
      />
      <WarningToast message={errorMessage} onDismiss={clearErrorMessage} />
    </div>
  )
}
