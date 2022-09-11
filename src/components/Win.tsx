import * as React from 'react'
import { Link } from 'react-router-dom'

export enum WinEnum {
  PlayerOneWin,
  PlayerTwoWin,
  Tie
}

interface WinProps {
  playerTwoName: string | null
  winEnum: WinEnum
  playerOneScore: number
  playerTwoScore: number
}

export function Win({
  playerTwoName,
  winEnum,
  playerOneScore,
  playerTwoScore
}: WinProps) {
  let winMessage

  switch (winEnum) {
    case WinEnum.PlayerOneWin:
      winMessage = `You win with ${playerOneScore} points!`
      break
    case WinEnum.PlayerTwoWin:
      winMessage = `${playerTwoName ?? 'They'} win${
        playerTwoName !== null ? 's' : ''
      } with ${playerTwoScore} points!`
      break
    case WinEnum.Tie:
      winMessage = `This is a tie! Nobody wins!`
      break
  }

  return (
    <div className='grid justify-items-center gap-2'>
      <p>{winMessage}</p>
      <Link
        className='rounded-md border-2 bg-slate-50 py-1 px-2 hover:bg-slate-100'
        to={'/'}
      >
        Replay
      </Link>
    </div>
  )
}
