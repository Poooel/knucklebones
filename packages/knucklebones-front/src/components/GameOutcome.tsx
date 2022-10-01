import * as React from 'react'
import { Link } from 'react-router-dom'
import { GameState } from 'knucklebones-common/src/types/gameState'
import { Player } from 'knucklebones-common/src/types/player'

interface GameOutcomeProps extends GameState {
  clientId: string
}

function getWinnerName(clientId: string, player: Player) {
  return clientId === player.id ? 'You' : player.id
}

const getWinMessage = (
  clientId: string,
  { gameOutcome, playerOne, playerTwo }: GameState
) => {
  if (gameOutcome === 'player-one-win' && playerOne !== undefined) {
    const winnerName = getWinnerName(clientId, playerOne)
    return `${winnerName} won with ${playerOne.score} points!`
  }
  if (gameOutcome === 'player-two-win' && playerTwo !== undefined) {
    const winnerName = getWinnerName(clientId, playerTwo)
    return `${winnerName} won with ${playerTwo.score} points!`
  }
}

export function GameOutcome({ clientId, ...gameState }: GameOutcomeProps) {
  const { gameOutcome } = gameState

  if (gameOutcome === 'not-started') {
    return (
      <p className='animate-pulse text-slate-900 dark:text-slate-200'>
        Waiting for an opponent to join...
      </p>
    )
  }
  if (gameOutcome === 'ongoing') {
    // Should add player names here
    return <p className='text-slate-900 dark:text-slate-200'>VS</p>
  }
  if (gameOutcome === 'tie') {
    return (
      <p className='font-semibold text-slate-900 dark:text-slate-200'>
        This is a tie! Nobody wins!
      </p>
    )
  }

  return (
    <div className='grid justify-items-center gap-2 font-semibold text-slate-900 dark:text-slate-50'>
      <p>{getWinMessage(clientId, gameState)}</p>
      <Link
        className='rounded-md border-2 border-slate-200 bg-transparent py-1 px-2 transition-colors duration-100 hover:bg-black/10 dark:border-slate-700 dark:hover:bg-white/10'
        to={'/'}
      >
        Replay
      </Link>
    </div>
  )
}
