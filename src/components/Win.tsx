import * as React from 'react'
import { Link } from 'react-router-dom'
import { ColumnDice, getScore } from '../utils/score'

interface WinProps {
  opponentName: string | null
  opponentWin: boolean
  columns: ColumnDice[]
  opponentColumns: ColumnDice[]
}

export function Win({
  opponentName,
  opponentWin,
  columns,
  opponentColumns
}: WinProps) {
  const { totalScore } = getScore(columns)
  const { totalScore: opponentTotalScore } = getScore(opponentColumns)

  return (
    <div className='grid justify-items-center gap-2'>
      <p>
        {opponentWin ? opponentName ?? 'They' : 'You'} win with{' '}
        {opponentWin ? opponentTotalScore : totalScore} points!
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
