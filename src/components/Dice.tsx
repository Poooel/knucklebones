import * as React from 'react'
import { clsx } from 'clsx'

interface DiceProps {
  value: number
  count?: number
}

export function DicePlaceholder() {
  return <div className='aspect-square h-14 md:h-16'></div>
}

export function Dice({ value, count = 1 }: DiceProps) {
  return (
    <div
      className={clsx(
        'flex aspect-square h-14 select-none flex-row items-center justify-center rounded shadow-md md:h-16',
        {
          'border border-slate-300 bg-white shadow-slate-200': count === 1,
          'border border-yellow-300 bg-yellow-200 shadow-yellow-200':
            count === 2,
          'border border-blue-300 bg-blue-200 shadow-blue-200': count === 3
        }
      )}
    >
      <p>{value}</p>
    </div>
  )
}
