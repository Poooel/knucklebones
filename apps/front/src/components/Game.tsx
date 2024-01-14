import * as React from 'react'
import { useGame } from '../hooks/useGame'
import { PlayerBoard } from './Board'
import { GameOutcome } from './GameOutcome'
import { Loading } from './Loading'
import { WarningToast } from './WarningToast'
import { QRCodeModal } from './QRCode'
import { HowToPlayModal } from './HowToPlay'
import { OutcomeHistory } from './OutcomeHistory'
import { SideBar } from './SideBar'
import { Theme } from './Theme'
import { useIsOnMobile } from '../hooks/detectDevice'
import { Language } from './Language'
import { useNoIndex } from '../hooks/useNoIndex'

export function Game() {
  const gameStore = useGame()
  const isOnMobile = useIsOnMobile()
  const gameRef = React.useRef<React.ElementRef<'div'>>(null)
  useNoIndex()

  if (gameStore === null) {
    return <Loading />
  }

  const {
    outcome,
    rematchVote,
    outcomeHistory,
    nextPlayer,
    winner,
    playerOne,
    playerTwo,
    isLoading,
    errorMessage,
    playerSide,
    boType,
    clearErrorMessage,
    sendPlay,
    updateDisplayName,
    voteContinueBo,
    voteContinueIndefinitely,
    voteRematch
  } = gameStore

  const isSpectator = playerSide === 'spectator'
  const canPlay = !isLoading && outcome === 'ongoing' && !isSpectator
  const canPlayerOnePlay = canPlay && nextPlayer?.id === playerOne?.id
  const canPlayerTwoPlay = canPlay && nextPlayer?.id === playerTwo?.id

  // Pas tip top je trouve, mais virtuellement ça marche
  const gameOutcome = (
    <GameOutcome
      playerOne={playerOne}
      playerTwo={playerTwo}
      winner={winner}
      outcome={outcome}
      rematchVote={rematchVote}
      playerSide={playerSide}
      boType={boType}
      onRematch={() => {
        void voteRematch()
      }}
      onContinue={() => {
        void voteContinueBo()
      }}
      onContinueIndefinitely={() => {
        void voteContinueIndefinitely()
      }}
    />
  )

  return (
    <div className='lg:grid-cols-3-central grid grid-cols-1'>
      <SideBar
        gameRef={gameRef}
        actions={
          <>
            <HowToPlayModal />
            <Theme />
            <Language />
            <QRCodeModal />
            <OutcomeHistory
              boType={boType}
              playerSide={playerSide}
              outcomeHistory={outcomeHistory}
              playerOne={playerOne}
              playerTwo={playerTwo}
            />
            {isOnMobile && gameOutcome}
          </>
        }
      />
      <div
        ref={gameRef}
        className='h-svh flex flex-1 flex-col items-center justify-around'
      >
        <PlayerBoard
          {...playerTwo}
          isPlayerOne={false}
          isNextPlayer={nextPlayer?.id === playerTwo?.id}
          canPlay={canPlayerTwoPlay}
          outcome={outcome}
        />
        {!isOnMobile && gameOutcome}
        <PlayerBoard
          {...playerOne}
          isPlayerOne
          isNextPlayer={nextPlayer?.id === playerOne?.id}
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
