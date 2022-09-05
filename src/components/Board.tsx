import * as React from 'react'
import { clsx } from 'clsx'
import { BoardDice, getScore } from '../utils/score'
import { Dice, DicePlaceholder } from './Dice'
import { Column } from './Column'
import { Cell } from './Cell'
import { SidePanel } from './SidePanel'
import { Name } from './Name'

interface BoardProps {
  columns: BoardDice
  nextDie: number | null
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
        'flex items-center gap-2 text-slate-900 md:w-full md:items-stretch md:gap-8',
        {
          'flex-col md:flex-row-reverse': !isOpponentBoard,
          'flex-col-reverse md:flex-row': isOpponentBoard,
          'opacity-75': !canPlay,
          'font-semibold': canPlay
        }
      )}
    >
      <div className='hidden md:block md:flex-1'>
        {/* Placeholder on desktop to keep the board centered */}
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
            'grid aspect-square grid-cols-3 divide-x-2 rounded-lg bg-slate-50 shadow-lg shadow-slate-200'
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
      <SidePanel
        nextDie={nextDie}
        isOpponentBoard={isOpponentBoard}
        name={name}
        totalScore={totalScore}
      />
    </div>
  )
}
