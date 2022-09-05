import * as React from 'react'
import { clsx } from 'clsx'

export interface DiceProps {
  value: number
  count?: number
  fullSize?: boolean
  className?: string
}

// TODO: Either we set the size of the board, and we let it decide the size of
// the dice
// Or we set the size of the dice, and the size of the board will derive from
// it (but we need a placeholder when no die is placed)
export function Dice({
  value,
  count = 1,
  fullSize = true,
  className
}: DiceProps) {
  return (
    <div
      className={clsx(
        'flex aspect-square select-none flex-row items-center justify-center rounded border bg-white',
        {
          'h-full w-full': fullSize,
          'bg-white': count === 1,
          'bg-yellow-200': count === 2,
          'bg-blue-200': count === 3
        },
        className
      )}
    >
      <p>{value}</p>
    </div>
  )
}
