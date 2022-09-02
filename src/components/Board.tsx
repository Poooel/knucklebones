import * as React from 'react'
import { clsx } from 'clsx'
import { BoardDice, ColumnDice, getScore } from '../utils/score'

interface Children {
  children: React.ReactNode
}

interface DiceProps {
  value: number
  fullSize?: boolean
  className?: string
}

interface ColumnProps extends Children {
  onClick?: React.MouseEventHandler<HTMLDivElement>
  readonly?: boolean
}

interface UseBoardProps {
  onDicePlaced?(column: number, value: number): void
}

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

// TODO: Either we set the size of the board, and we let it decide the size of
// the dice
// Or we set the size of the dice, and the size of the board will derive from
// it (but we need a placeholder when no die is placed)

function Dice({ value, fullSize = true, className }: DiceProps) {
  return (
    <div
      className={clsx(
        'flex aspect-square select-none flex-row items-center justify-center rounded border bg-white',
        {
          'h-full w-full': fullSize
        },
        className
      )}
    >
      <p>{value}</p>
    </div>
  )
}

function Cell({ children }: Children) {
  return (
    <div className='flex flex-row items-center justify-center border p-4'>
      {children}
    </div>
  )
}

function Column({ children, onClick, readonly = false }: ColumnProps) {
  return (
    <div
      className={clsx('grid grid-rows-3', {
        'hover:bg-gray-100': !readonly
      })}
      role={onClick !== undefined ? 'button' : undefined}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function useBoard({ onDicePlaced }: UseBoardProps = {}) {
  const [columns, setColumns] = React.useState(
    Array.from<ColumnDice>({ length: MAX_COLUMNS }).fill([])
  )

  const isBoardFull = columns.flat().filter((v) => v !== undefined)

  function addToColumn(
    index: number,
    value: number,
    triggerCallback: boolean = true
  ) {
    const canPlaceDice = columns[index].length < MAX_CELLS_PER_COLUMNS
    if (canPlaceDice) {
      setColumns((previous) => {
        return previous.map((column, colIndex) => {
          if (colIndex === index) {
            return column.concat(value)
          }
          return column
        })
      })
      if (triggerCallback) {
        onDicePlaced?.(index, value)
      }
    }
  }

  return {
    columns,
    isBoardFull,
    addToColumn
  }
}

export function Board({
  columns,
  nextDie,
  onColumnClick,
  isOpponentBoard = false,
  canPlay = false,
  name
}: BoardProps) {
  const scorePerColumn = getScore(columns)
  const total = scorePerColumn.reduce((acc, col) => acc + col, 0)

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
          {scorePerColumn.map((score, index) => (
            <p className='text-center' key={index}>
              {score}
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
                    {value !== undefined && <Dice value={value} />}
                  </Cell>
                )
              })}
            </Column>
          ))}
        </div>
      </div>
      <div
        className={clsx(
          'flex flex-1 items-center justify-between md:items-start md:justify-start md:gap-4',
          {
            'flex-row md:flex-col-reverse md:items-end': !isOpponentBoard,
            'flex-row-reverse md:flex-col md:items-start': isOpponentBoard
          }
        )}
      >
        {nextDie !== undefined && (
          <Dice value={nextDie} fullSize={false} className='h-12 md:h-16' />
        )}
        <p>Total: {total}</p>
        {name != null ? (
          <p>
            {name} ({isOpponentBoard ? 'opponent' : 'you'})
          </p>
        ) : (
          <p>{isOpponentBoard ? 'Opponent' : 'You'}</p>
        )}
      </div>
    </div>
  )
}
