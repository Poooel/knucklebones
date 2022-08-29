import * as React from 'react'
import { clsx } from 'clsx'

interface Children {
  children: React.ReactNode
}

interface DiceProps {
  value: number
}

interface ColumnProps extends Children {
  onClick?: React.MouseEventHandler<HTMLDivElement>
  readonly?: boolean
}

interface UseBoardProps {
  onDicePlaced?(): void
}

interface BoardProps {
  columns: Array<Array<number | undefined>>
  onColumnClick?(colIndex: number): void
  readonly?: boolean
}

const MAX_COLUMNS = 3
const MAX_CELLS_PER_COLUMNS = 3

const COLUMNS_PLACEHOLDER = Array.from({ length: MAX_COLUMNS })
const CELLS_PER_COLUMN_PLACEHOLDER = Array.from({
  length: MAX_CELLS_PER_COLUMNS
})

function Dice({ value }: DiceProps) {
  return (
    <div className='rounded border bg-white w-full h-full flex flex-row justify-center items-center'>
      <p>{value}</p>
    </div>
  )
}

function Cell({ children }: Children) {
  return (
    <div className='flex flex-row items-center justify-center border p-4 md:p-8'>
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

export function useBoard({ onDicePlaced }: UseBoardProps) {
  const [columns, setColumns] = React.useState(
    Array.from<number[]>({ length: MAX_COLUMNS }).fill([])
  )

  const isBoardFull = columns.flat().filter((v) => v !== undefined)

  function addToColumn(index: number, value: number) {
    setColumns((previous) => {
      return previous.map((column, colIndex) => {
        if (colIndex === index && column.length < MAX_CELLS_PER_COLUMNS) {
          onDicePlaced?.()
          return column.concat(value)
        }
        return column
      })
    })
  }

  function removeFromColumn(index: number) {
    setColumns((previous) => {
      return previous.map((column, colIndex) => {
        if (colIndex === index && column.length > 1) {
          return column.slice(0, index + 1)
        }
        return column
      })
    })
  }

  return {
    columns,
    isBoardFull,
    addToColumn,
    removeFromColumn
  }
}

export function Board({
  columns,
  onColumnClick,
  readonly = false
}: BoardProps) {
  return (
    <div className='grid aspect-square h-2/5 grid-cols-3 border'>
      {COLUMNS_PLACEHOLDER.map((_, colIndex) => (
        <Column
          key={colIndex}
          readonly={readonly}
          onClick={!readonly ? () => onColumnClick?.(colIndex) : undefined}
        >
          {CELLS_PER_COLUMN_PLACEHOLDER.map((_, cellIndex) => {
            const value = columns[colIndex][cellIndex]
            return (
              <Cell key={cellIndex}>
                {value !== undefined && <Dice value={value} />}
              </Cell>
            )
          })}
        </Column>
      ))}
    </div>
  )
}
