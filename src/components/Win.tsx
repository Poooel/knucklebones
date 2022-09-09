import * as React from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const { totalScore } = getScore(columns)
  const { totalScore: opponentTotalScore } = getScore(opponentColumns)

  return (
    <div className='grid justify-items-center gap-2'>
      <p>
        {opponentWin ? opponentName : 'You'} win with{' '}
        {opponentWin ? opponentTotalScore : totalScore} points!
      </p>
      <button
        className='rounded-md border-2 bg-slate-50 py-1 px-2 hover:bg-slate-100'
        type='button'
        onClick={() => {
          navigate('/')
        }}
      >
        Replay
      </button>
    </div>
  )
}
