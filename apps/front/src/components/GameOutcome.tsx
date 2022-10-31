import * as React from 'react'
import { Link } from 'react-router-dom'
import { GameState, getNameFromPlayer, Player } from '@knucklebones/common'

interface OutcomeProps extends GameState {
  playerId: string
  onRematch(): void
}

function getWinnerName(playerId: string, player: Player) {
  return playerId === player.id ? 'You' : getNameFromPlayer(player)
}

const getWinMessage = (
  playerId: string,
  { gameOutcome, playerOne, playerTwo }: GameState
) => {
  if (gameOutcome === 'player-one-win') {
    const winnerName = getWinnerName(playerId, playerOne!)
    return `${winnerName} won with ${playerOne!.score} points!`
  }
  if (gameOutcome === 'player-two-win') {
    const winnerName = getWinnerName(playerId, playerTwo!)
    return `${winnerName} won with ${playerTwo!.score} points!`
  }
  if (gameOutcome === 'tie') {
    return 'This is a tie! Nobody wins!'
  }
}

export function GameOutcome({
  playerId,
  onRematch,
  ...gameState
}: OutcomeProps) {
  const { gameOutcome } = gameState
  const hasVotedRematch = !gameState.rematchVote.includes(playerId)

  if (gameOutcome === 'ongoing' || gameOutcome === 'not-started') {
    return <p className='text-slate-900 dark:text-slate-200'>VS</p>
  }

  const playerTwoId =
    playerId === gameState.playerOne?.id
      ? getNameFromPlayer(gameState.playerTwo)
      : getNameFromPlayer(gameState.playerOne)

  return (
    <div className='grid justify-items-center gap-2 font-semibold text-slate-900 dark:text-slate-50'>
      <p>{getWinMessage(playerId, gameState)}</p>
      <div className='flex gap-4'>
        <Link
          className='rounded-md border-2 border-slate-200 bg-transparent py-1 px-2 transition-colors duration-100 hover:bg-black/10 dark:border-slate-700 dark:hover:bg-white/10'
          to={'/'}
        >
          Replay
        </Link>
        <button
          className='rounded-md border-2 border-slate-200 bg-transparent py-1 px-2 transition-colors duration-100 enabled:hover:bg-black/10 disabled:opacity-50 dark:border-slate-700 enabled:dark:hover:bg-white/10'
          onClick={onRematch}
          disabled={!hasVotedRematch}
        >
          Rematch
        </button>
      </div>
      {!hasVotedRematch ? (
        <p>Waiting for {playerTwoId}...</p>
      ) : (
        gameState.rematchVote.length === 1 && (
          <p>{playerTwoId} wants to rematch!</p>
        )
      )}
    </div>
  )
}
