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
import { ActionGroup, Navigation } from './Navigation'
import { Theme } from './Theme'
import { useIsOnMobile } from '../hooks/detectDevice'

export function Game() {
  const gameStore = useGame()
  const isOnMobile = useIsOnMobile()
  const gameRef = React.useRef<React.ElementRef<'div'>>(null)

  if (gameStore === null) {
    return <Loading />
  }

  const {
    outcome,
    rematchVote,
    outcomeHistory,
    logs,
    nextPlayer,
    winner,
    playerOne,
    playerTwo,
    isLoading,
    errorMessage,
    sendPlay,
    clearErrorMessage,
    sendRematch,
    updateDisplayName,
    playerSide
  } = gameStore

  const isSpectator = playerSide === 'spectator'
  const canPlay = !isLoading && outcome === 'ongoing' && !isSpectator
  const canPlayerOnePlay = canPlay && nextPlayer?.id === playerOne?.id
  const canPlayerTwoPlay = canPlay && nextPlayer?.id === playerTwo?.id

  // Pas tip top je trouve, mais virtuellement ça marche
  // Par contre, la modale réapparaît à chaque qu'on ouvre à nouveau le menu
  // ça c'est pas ouf
  const gameOutcome = (
    <GameOutcome
      playerOne={playerOne}
      playerTwo={playerTwo}
      winner={winner}
      outcome={outcome}
      rematchVote={rematchVote}
      onRematch={() => {
        void sendRematch()
      }}
      playerSide={playerSide}
    />
  )

  return (
    <div className='md:grid-cols-3-central grid grid-cols-1'>
      <Navigation
        gameRef={gameRef}
        actions={
          <>
            <ActionGroup>
              <OutcomeHistory
                playerSide={playerSide}
                outcomeHistory={outcomeHistory}
                playerOne={playerOne}
                playerTwo={playerTwo}
              />
              {isOnMobile && gameOutcome}
            </ActionGroup>
            <ActionGroup>
              <LogsModal logs={logs} />
              <QRCodeModal />
              <Theme />
              <HowToPlayModal />
            </ActionGroup>
          </>
        }
      />
      <div
        ref={gameRef}
        className='flex flex-1 flex-col items-center justify-around'
      >
        <PlayerBoard
          {...playerTwo}
          isPlayerOne={false}
          canPlay={canPlayerTwoPlay}
          outcome={outcome}
        />
        {!isOnMobile && gameOutcome}
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
      <div></div>
    </div>
  )
}
