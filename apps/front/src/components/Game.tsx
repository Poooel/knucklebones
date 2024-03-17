import * as React from 'react'
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
import { useGameWhileLoading } from './GameContext'
import { PlayerOneBoard, PlayerTwoBoard } from './PlayerBoard'

export function Game() {
  const gameStore = useGameWhileLoading()
  const isOnMobile = useIsOnMobile()
  const gameRef = React.useRef<React.ElementRef<'div'>>(null)
  useNoIndex()

  if (gameStore === null) {
    return <Loading />
  }

  const { errorMessage, clearErrorMessage } = gameStore

  // Pas tip top je trouve, mais virtuellement ça marche
  const gameOutcome = <GameOutcome />

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
            <OutcomeHistory />
            {isOnMobile && gameOutcome}
          </>
        }
      />
      <div
        ref={gameRef}
        className='h-svh flex flex-1 flex-col items-center justify-around'
      >
        <PlayerTwoBoard />
        {!isOnMobile && gameOutcome}
        <PlayerOneBoard />
        <WarningToast message={errorMessage} onDismiss={clearErrorMessage} />
      </div>
      <div></div>
    </div>
  )
}
