import * as React from 'react'
import { clsx } from 'clsx'
import { BoardDice, getScore } from '../utils/score'
import { Dice } from './Dice'
import { Column } from './Column'
import { Cell } from './Cell'
import { SidePanel } from './SidePanel'

interface BoardProps {
  columns: BoardDice
  nextDie?: number
  onColumnClick?(colIndex: number): void
  isOpponentBoard?: boolean
  canPlay?: boolean
  name: string | null
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
      className={clsx('flex gap-4 md:w-full md:gap-8', {
        'flex-col md:flex-row-reverse': !isOpponentBoard,
        'flex-col-reverse md:flex-row': isOpponentBoard
      })}
    >
      <div className='flex-1'></div>
      <div
        className={clsx('flex gap-2', {
          'flex-col': !isOpponentBoard,
          'flex-col-reverse': isOpponentBoard
        })}
      >
        <div className='grid grid-cols-3'>
          {scorePerColumn.map(({ total }, index) => (
            <p className='text-center' key={index}>
              {total}
            </p>
          ))}
        </div>
        <div className='grid aspect-square h-[30vh] grid-cols-3 border'>
          {COLUMNS_PLACEHOLDER.map((_, colIndex) => (
            <Column
              key={colIndex}
              readonly={!canPlay}
              onClick={canPlay ? () => onColumnClick?.(colIndex) : undefined}
            >
              {CELLS_PER_COLUMN_PLACEHOLDER.map((_, cellIndex) => {
                // Reverses the render order to miror the board for the opponent
                const actualCellIndex = isOpponentBoard
                  ? MAX_CELLS_PER_COLUMNS - cellIndex - 1
                  : cellIndex
                const value = columns[colIndex][actualCellIndex]
                return (
                  <Cell key={cellIndex}>
                    {value !== undefined && (
                      <Dice
                        value={value}
                        count={scorePerColumn[colIndex].countedDice.get(value)}
                      />
                    )}
                  </Cell>
                )
              })}
            </Column>
          ))}
        </div>
      </div>
      <SidePanel
        nextDie={nextDie}
        isOpponentBoard={isOpponentBoard}
        name={name}
        totalScore={totalScore}
      />
    </div>
  )
}
