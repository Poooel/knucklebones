import { useGame } from '../GameContext'
import { PlayerBoard } from './Board'

export function PlayerOneBoard() {
  const {
    outcome,
    nextPlayer,
    playerOne,
    isLoading,
    playerSide,
    sendPlay,
    updateDisplayName
  } = useGame()

  const isSpectator = playerSide === 'spectator'
  const canPlay = !isLoading && outcome === 'ongoing' && !isSpectator
  const canPlayerOnePlay = canPlay && nextPlayer?.id === playerOne?.id

  return (
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
  )
}
