import { useGame } from '../GameContext'
import { PlayerBoard } from './Board'

export function PlayerTwoBoard() {
  const { outcome, nextPlayer, playerTwo, isLoading, playerSide } = useGame()

  const isSpectator = playerSide === 'spectator'
  const canPlay = !isLoading && outcome === 'ongoing' && !isSpectator
  const canPlayerTwoPlay = canPlay && nextPlayer?.id === playerTwo?.id

  return (
    <PlayerBoard
      {...playerTwo}
      isPlayerOne={false}
      isNextPlayer={nextPlayer?.id === playerTwo?.id}
      canPlay={canPlayerTwoPlay}
      outcome={outcome}
    />
  )
}
