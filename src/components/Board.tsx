import * as React from 'react'
import { clsx } from 'clsx'
import { Player } from '../../shared/types/player'
import { Dice } from './Dice'
import { Column } from './Column'
import { Cell } from './Cell'
import { Name } from './Name'

interface BoardProps extends Player {
  isPlayerOne: boolean
  canPlay: boolean
  onColumnClick?(colIndex: number): void
}

const MAX_COLUMNS = 3
const MAX_CELLS_PER_COLUMNS = 3

const COLUMNS_PLACEHOLDER = Array.from({ length: MAX_COLUMNS })
const CELLS_PER_COLUMN_PLACEHOLDER = Array.from({
  length: MAX_CELLS_PER_COLUMNS
})

export function Board({
  score,
  scorePerColumn,
  columns,
  dice,
  isPlayerOne,
  id,
  canPlay = false,
  onColumnClick
}: BoardProps) {
  return (
    <div
      className={clsx(
        'flex w-full flex-row justify-center gap-2 text-slate-900 transition duration-100 md:gap-8',
        {
          'items-end': isPlayerOne,
          'items-start': !isPlayerOne,
          'opacity-75': !canPlay,
          'font-semibold': canPlay
        }
      )}
    >
      <div className='my-4 grid flex-1 place-content-end'>
        <Dice value={canPlay ? dice : undefined} />
      </div>
      <div
        className={clsx('flex items-center gap-1 md:gap-4', {
          'flex-col': isPlayerOne,
          'flex-col-reverse': !isPlayerOne
        })}
      >
        <Name name={id} isPlayerOne={isPlayerOne} />
        <div className='grid w-full grid-cols-3'>
          {/* {scorePerColumn.map(({ total }, index) => (
            <p className='text-center' key={index}>
              {total}
            </p>
          ))} */}
        </div>
        <div
          className={clsx(
            'grid aspect-square grid-cols-3 divide-x-2 divide-slate-300 rounded-lg border bg-slate-50 shadow-lg shadow-slate-300'
          )}
        >
          {COLUMNS_PLACEHOLDER.map((_, colIndex) => {
            const column = columns[colIndex]
            const canPlayInColumn =
              isPlayerOne && canPlay && column.length < MAX_CELLS_PER_COLUMNS
            return (
              <Column
                key={colIndex}
                readonly={!canPlayInColumn}
                onClick={
                  canPlayInColumn ? () => onColumnClick?.(colIndex) : undefined
                }
              >
                {CELLS_PER_COLUMN_PLACEHOLDER.map((_, cellIndex) => {
                  // Reverses the render order to mirror the board for the opponent
                  const actualCellIndex = !isPlayerOne
                    ? MAX_CELLS_PER_COLUMNS - cellIndex - 1
                    : cellIndex
                  const value = column[actualCellIndex]
                  return (
                    <Cell key={cellIndex}>
                      <Dice
                        value={value}
                        // count={scorePerColumn[colIndex].countedDice.get(value)}
                      />
                    </Cell>
                  )
                })}
              </Column>
            )
          })}
        </div>
      </div>
      <div className='my-4 grid flex-1 place-content-start'>
        <p>Total: {score}</p>
      </div>
    </div>
  )
}
