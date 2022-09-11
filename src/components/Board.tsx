import * as React from 'react'
import { clsx } from 'clsx'
import { BoardDice, getScore } from '../utils/score'
import { Dice, DicePlaceholder } from './Dice'
import { Column } from './Column'
import { Cell } from './Cell'
import { Name } from './Name'

interface BoardProps {
  columns: BoardDice
  nextDie: number
  name: string | null
  isOpponentBoard?: boolean
  canPlay?: boolean
  onColumnClick?(colIndex: number): void
}

const MAX_COLUMNS = 3
const MAX_CELLS_PER_COLUMNS = 3

const COLUMNS_PLACEHOLDER = Array.from({ length: MAX_COLUMNS })
const CELLS_PER_COLUMN_PLACEHOLDER = Array.from({
  length: MAX_CELLS_PER_COLUMNS
})

export function Board({
  columns,
  nextDie,
  onColumnClick,
  isOpponentBoard = false,
  canPlay = false,
  name
}: BoardProps) {
  const { scorePerColumn, totalScore } = getScore(columns)

  return (
    <div
      className={clsx(
        'flex justify-center gap-2 text-slate-900 md:w-full md:gap-8',
        {
          'flex-row items-end': !isOpponentBoard,
          'flex-row-reverse items-start': isOpponentBoard,
          'opacity-75': !canPlay,
          'font-semibold': canPlay
        }
      )}
    >
      <div className='my-4'>
        {canPlay ? <Dice value={nextDie} /> : <DicePlaceholder />}
      </div>
      <div
        className={clsx('flex items-center gap-1 md:gap-4', {
          'flex-col': !isOpponentBoard,
          'flex-col-reverse': isOpponentBoard
        })}
      >
        <Name name={name} isOpponent={isOpponentBoard} />
        <div className='grid w-full grid-cols-3'>
          {scorePerColumn.map(({ total }, index) => (
            <p className='text-center' key={index}>
              {total}
            </p>
          ))}
        </div>
        <div
          className={clsx(
            'grid aspect-square grid-cols-3 divide-x-2 divide-slate-300 rounded-lg border bg-slate-50 shadow-lg shadow-slate-300'
          )}
        >
          {COLUMNS_PLACEHOLDER.map((_, colIndex) => {
            const column = columns[colIndex]
            const canPlayInColumn =
              !isOpponentBoard &&
              canPlay &&
              column.length < MAX_CELLS_PER_COLUMNS
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
                  const actualCellIndex = isOpponentBoard
                    ? MAX_CELLS_PER_COLUMNS - cellIndex - 1
                    : cellIndex
                  const value = column[actualCellIndex]
                  return (
                    <Cell key={cellIndex}>
                      {value !== undefined ? (
                        <Dice
                          value={value}
                          count={scorePerColumn[colIndex].countedDice.get(
                            value
                          )}
                        />
                      ) : (
                        // Allows to properly reserve the space without placing a dice
                        <DicePlaceholder />
                      )}
                    </Cell>
                  )
                })}
              </Column>
            )
          })}
        </div>
      </div>
      <div className='my-4'>
        <p>Total: {totalScore}</p>
      </div>
    </div>
  )
}
