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
  const gameStore = useGame()

  if (gameStore === null) {
    return <Loading />
  }

  const {
    outcome,
    rematchVote,
    outcomeHistory,
    logs,
    nextPlayer,
    playerOne,
    playerTwo,
    isLoading,
    sendPlay,
    errorMessage,
    clearErrorMessage,
    sendRematch,
    updateDisplayName,
    playerSide
  } = gameStore

  const isSpectator = playerSide === 'spectator'
  const canPlay = !isLoading && outcome === 'ongoing' && !isSpectator
  const canPlayerOnePlay = canPlay && nextPlayer?.id === playerOne?.id
  const canPlayerTwoPlay = canPlay && nextPlayer?.id === playerTwo?.id

  return (
    <div className='grid grid-cols-1'>
      <div className='h-svh flex flex-col items-center justify-around lg:h-screen'>
        <PlayerBoard
          {...playerTwo}
          isPlayerOne={false}
          canPlay={canPlayerTwoPlay}
          outcome={outcome}
        />
        <GameOutcome
          playerOne={playerOne}
          playerTwo={playerTwo}
          outcome={outcome}
          rematchVote={rematchVote}
          onRematch={() => {
            void sendRematch()
          }}
          playerSide={playerSide}
        />
        <PlayerBoard
          {...playerOne}
          isPlayerOne
          onColumnClick={
            canPlayerOnePlay
              ? (column) => {
                  void sendPlay(column)
                }
              : undefined
          }
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
        outcomeHistory={outcomeHistory}
        playerOne={playerOne}
        playerTwo={playerTwo}
      />
      <LogsModal logs={logs} />
      <QRCodeModal />
      <HowToPlayModal />
    </div>
  )
}
