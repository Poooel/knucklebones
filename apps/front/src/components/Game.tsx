import * as React from 'react'
import { ArrowUpIcon } from '@heroicons/react/24/solid'
import { useGame } from '../hooks/useGame'
import { PlayerBoard } from './Board'
import { Logs } from './Logs'
import { GameOutcome } from './GameOutcome'
import { Loading } from './Loading'
import { WarningToast } from './WarningToast'
import { IconButton } from './IconButton'
import { QRCodeModal } from './QRCodeModal'
import { HowToPlayModal } from './HowToPlay'

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function Game() {
  const {
    gameState,
    playerOne,
    playerTwo,
    isLoading,
    sendPlay,
    errorMessage,
    clearErrorMessage,
    sendRematch,
    updateDisplayName,
    playerId
  } = useGame()

  if (gameState === null) {
    return <Loading />
  }

  const { outcome, nextPlayer } = gameState

  const isSpectator = playerId !== playerOne?.id && playerId !== playerTwo?.id

  const canPlay = !isLoading && outcome === 'ongoing' && !isSpectator
  const canPlayerOnePlay = canPlay && nextPlayer?.id === playerOne?.id
  const canPlayerTwoPlay = canPlay && nextPlayer?.id === playerTwo?.id

  return (
    <div className='lg:grid-cols-3-central grid grid-cols-1'>
      <div className='h-95 flex flex-col items-center justify-evenly lg:h-screen'>
        <PlayerBoard
          {...playerTwo!}
          isPlayerOne={false}
          canPlay={canPlayerTwoPlay}
          outcome={outcome}
        />
        <GameOutcome
          {...gameState}
          playerId={playerOne!.id}
          onRematch={() => {
            void sendRematch()
          }}
          isSpectator={isSpectator}
        />
        <PlayerBoard
          {...playerOne!}
          isPlayerOne
          onColumnClick={canPlayerOnePlay ? sendPlay : undefined}
          canPlay={canPlayerOnePlay}
          updateDisplayName={(displayName) => {
            void updateDisplayName(displayName)
          }}
          isDisplayNameEditable={!isSpectator}
          outcome={outcome}
        />
        <WarningToast message={errorMessage} onDismiss={clearErrorMessage} />
      </div>

      <div className='h-95 flex flex-col items-center pb-4 lg:order-first lg:h-full lg:items-start lg:justify-end lg:pb-0'>
        {/* min-h-0 allows item to properly shrink, when used with flex-1.
        Ref: https://stackoverflow.com/questions/36247140/why-dont-flex-items-shrink-past-content-size */}
        <div className='min-h-0 flex-1 p-4 lg:h-60 lg:flex-none'>
          <Logs logs={gameState.logs} />
        </div>
        <IconButton
          icon={<ArrowUpIcon />}
          onClick={scrollToTop}
          className='animate-bounce lg:hidden'
        />
      </div>
      <QRCodeModal />
      <HowToPlayModal />
    </div>
  )
}
