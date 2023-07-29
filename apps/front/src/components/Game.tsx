import * as React from 'react'
import { useGame } from '../hooks/useGame'
import { PlayerBoard } from './Board'
import { GameOutcome } from './GameOutcome'
import { Loading } from './Loading'
import { WarningToast } from './WarningToast'
import { QRCodeModal } from './QRCode'
import { HowToPlayModal } from './HowToPlay'
import { LogsModal } from './Logs'

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
    <div className='grid grid-cols-1'>
      <div className='h-svh flex flex-col items-center justify-around lg:h-screen'>
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
      <LogsModal logs={gameState.logs} />
      <QRCodeModal />
      <HowToPlayModal />
    </div>
  )
}
