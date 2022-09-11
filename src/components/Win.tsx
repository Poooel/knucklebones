import * as React from 'react'
import { Link } from 'react-router-dom'
import { GameState } from '../utils/gameState'
import { Score } from '../utils/score'

interface WinProps {
  gameState: GameState
  playerOneScore: Score
  playerTwoScore: Score
  playerTwoName: string | null
}

const getWinMessage = (
  gameState: GameState,
  playerOneScore: number,
  playerTwoScore: number,
  playerTwoName: string | null
) => {
  switch (gameState) {
    case GameState.PlayerOneWin:
      return `You win with ${playerOneScore} points!`
    case GameState.PlayerTwoWin:
      return `${playerTwoName ?? 'They'} win${
        playerTwoName !== null ? 's' : ''
      } with ${playerTwoScore} points!`
    case GameState.Tie:
      return `This is a tie! Nobody wins!`
    default:
      return 'VS'
  }
}

export function Win({
  gameState,
  playerOneScore,
  playerTwoScore,
  playerTwoName
}: WinProps) {
  return (
    <div className='grid justify-items-center gap-2'>
      <p>
        {getWinMessage(
          gameState,
          playerOneScore.totalScore,
          playerTwoScore.totalScore,
          playerTwoName
        )}
      </p>
      <Link
        className='rounded-md border-2 bg-slate-50 py-1 px-2 hover:bg-slate-100'
        to={'/'}
      >
        Replay
      </Link>
    </div>
  )
}
