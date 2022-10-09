import * as React from 'react'
import { ArrowUpIcon } from '@heroicons/react/24/solid'
import { useGame } from '../hooks/useGame'
import { Board } from './Board'
import { Logs } from './Logs'
import { GameOutcome } from './GameOutcome'
import { Loading } from './Loading'
import { WarningToast } from './WarningToast'

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

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
  const canPlayerOnePlay = canPlay && nextPlayer?.id === playerOne?.id
  const canPlayerTwoPlay = canPlay && nextPlayer?.id === playerTwo?.id

  return (
    <div className='grid grid-rows-2 lg:grid-cols-3 lg:grid-rows-none'>
      <div className='row-start-2 mb-4 flex flex-col items-center lg:row-start-auto lg:mb-0 lg:h-full lg:items-start lg:justify-end'>
        {/* min-h-0 allows item to properly shrink, when used with flex-1.
        Ref: https://stackoverflow.com/questions/36247140/why-dont-flex-items-shrink-past-content-size */}
        <div className='min-h-0 flex-1 p-4 lg:h-60 lg:flex-none'>
          <Logs logs={gameState.logs} />
        </div>
        {/* Write IconButton component */}
        <button
          onClick={scrollToTop}
          className='animate-bounce rounded-full text-slate-900 transition-colors duration-100 hover:text-slate-900/80 dark:text-slate-200 dark:hover:text-slate-50/80 lg:hidden'
        >
          <ArrowUpIcon className='aspect-square h-6' />
        </button>
      </div>
      <div className='grid h-[95vh] grid-cols-1 place-content-center'>
        <div className='flex flex-col items-center justify-between gap-12'>
          <Board
            {...playerTwo}
            isPlayerOne={false}
            canPlay={canPlayerTwoPlay}
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
            updateDisplayName={(displayName) => {
              void updateDisplayName(displayName)
            }}
          />
          <WarningToast message={errorMessage} onDismiss={clearErrorMessage} />
        </div>
      </div>
    </div>
  )
}
