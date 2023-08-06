import * as React from 'react'
import { useGame } from '../hooks/useGame'
import { PlayerBoard } from './Board'
import { GameOutcome } from './GameOutcome'
import { Loading } from './Loading'
import { WarningToast } from './WarningToast'
import { QRCodeModal } from './QRCode'
import { HowToPlayModal } from './HowToPlay'
import { LogsModal } from './Logs'
import { OutcomeHistory } from './OutcomeHistory'

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
    playerSide
  } = useGame()

  if (gameState === null) {
    return <Loading />
  }

  const { outcome, nextPlayer } = gameState

  const isSpectator = playerSide === 'spectator'
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
          // Could replace `gameState`'s players to make this easier?
          playerOne={playerOne!}
          playerTwo={playerTwo!}
          playerId={playerOne!.id}
          onRematch={() => {
            void sendRematch()
          }}
          playerSide={playerSide}
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
      <OutcomeHistory
        playerSide={playerSide}
        {...gameState}
        playerOne={playerOne!}
        playerTwo={playerTwo!}
      />
      <LogsModal logs={gameState.logs} />
      <QRCodeModal />
      <HowToPlayModal />
    </div>
  )
}
