import * as React from 'react'
import { Link } from 'react-router-dom'
import { GameState } from '../../shared-types/gameState'
import { Player } from '../../shared-types/player'

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
    return <p>Waiting for an opponent to join...</p>
  }
  if (gameOutcome === 'ongoing') {
    // Should add player names here
    return <p>VS</p>
  }
  if (gameOutcome === 'tie') {
    return <p>This is a tie! Nobody wins!</p>
  }

  return (
    <div className='grid justify-items-center gap-2 font-semibold text-slate-900'>
      <p>{getWinMessage(clientId, gameState)}</p>
      <Link
        className='rounded-md border-2 bg-slate-50 py-1 px-2 transition-colors duration-100 hover:bg-slate-100'
        to={'/'}
      >
        Replay
      </Link>
    </div>
  )
}
