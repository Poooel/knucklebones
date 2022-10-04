import * as React from 'react'
import { clsx } from 'clsx'
import { Player } from '@knucklebones/common'
import { countDiceInColumn } from '@knucklebones/common'
import { Dice } from './Dice'
import { Column } from './Column'
import { Cell } from './Cell'
import { Name } from './Name'

interface BoardProps extends Partial<Player> {
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
  id,
  dice,
  isPlayerOne,
  score = 0,
  scorePerColumn = [0, 0, 0],
  columns = [[], [], []],
  canPlay = false,
  onColumnClick
}: BoardProps) {
  return (
    <div
      className={clsx(
        'flex w-full flex-row justify-center gap-2 text-slate-900 transition duration-100 dark:text-slate-200 md:gap-8',
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
          {scorePerColumn.map((score, index) => (
            <p className='text-center' key={index}>
              {score}
            </p>
          ))}
        </div>
        <div className='grid aspect-square grid-cols-3 divide-x-2 divide-slate-300 rounded-lg bg-transparent shadow-lg shadow-slate-300 dark:divide-slate-800 dark:shadow-slate-800'>
          {COLUMNS_PLACEHOLDER.map((_, colIndex) => {
            const column = columns[colIndex]
            const countedDice = countDiceInColumn(column)
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
                      <Dice value={value} count={countedDice.get(value)} />
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
