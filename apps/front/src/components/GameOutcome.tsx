import * as React from 'react'
import { Link } from 'react-router-dom'
import { IGameState, IPlayer, Player } from '@knucklebones/common'

interface OutcomeProps extends IGameState {
  playerId: string
  onRematch(): void
}

function getWinnerName(playerId: string, player: IPlayer) {
  return playerId === player.id ? 'You' : Player.fromJson(player).getName()
}

const getWinMessage = (
  playerId: string,
  { outcome, playerOne, playerTwo }: IGameState
) => {
  if (outcome === 'player-one-win') {
    const winnerName = getWinnerName(playerId, playerOne)
    return `${winnerName} won with ${playerOne.score} points!`
  }
  if (outcome === 'player-two-win') {
    const winnerName = getWinnerName(playerId, playerTwo)
    return `${winnerName} won with ${playerTwo.score} points!`
  }
  if (outcome === 'tie') {
    return 'This is a tie! Nobody wins!'
  }
}

export function GameOutcome({
  playerId,
  onRematch,
  ...gameState
}: OutcomeProps) {
  const { outcome } = gameState
  const hasVotedRematch = gameState.rematchVote === playerId

  if (outcome === 'ongoing' || outcome === 'not-started') {
    return <p className='text-slate-900 dark:text-slate-200'>VS</p>
  }

  const playerTwoId =
    playerId === gameState.playerOne?.id
      ? Player.fromJson(gameState.playerTwo).getName()
      : Player.fromJson(gameState.playerOne).getName()

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
      {hasVotedRematch ? (
        <p>Waiting for {playerTwoId}...</p>
      ) : (
        gameState.rematchVote !== undefined &&
        gameState.rematchVote !== playerId && (
          <p>{playerTwoId} wants to rematch!</p>
        )
      )}
    </div>
  )
}
