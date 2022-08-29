import * as React from 'react'

interface Children {
  children: React.ReactNode
}

interface DiceProps {
  value: number
}

interface ColumnProps extends Children {
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

interface BoardsProps {
  readonly?: boolean
}

function getRandomValue(min = 0, max = 1) {
  return Math.round(Math.random() * (max - min) + min)
}

function Dice({ value }: DiceProps) {
  return <p className='rounded border bg-white py-4 px-6'>{value}</p>
}

function Cell({ children }: Children) {
  return (
    <div className='flex flex-row items-center justify-center border p-2'>
      {children}
    </div>
  )
}

function Column({ children, onClick }: ColumnProps) {
  return (
    <div
      className='grid grid-rows-3 hover:bg-gray-100'
      role={onClick !== undefined ? 'button' : undefined}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

const MAX_COLUMNS = 3
const MAX_CELLS_PER_COLUMNS = 3

export function Board({ readonly = false }: BoardsProps) {
  // Preset the three columns with 3 empty cells
  const [columns, setColumns] = React.useState<
    Array<Array<number | undefined>>
  >(
    Array.from({ length: MAX_COLUMNS }).map(() =>
      Array.from({ length: MAX_CELLS_PER_COLUMNS })
    )
  )

  function addToColumn(value: number, index: number) {
    setColumns((previous) => {
      return previous.map((column, colIndex) => {
        if (index === colIndex) {
          const nonEmptyCells = column.filter((v) => v !== undefined)
          // Checking that there are still space in the column for another value
          if (nonEmptyCells.length === MAX_CELLS_PER_COLUMNS) {
            return column
          }
          // Push new value
          nonEmptyCells.push(value)
          // Generates padding of empty values to keep 3 cells in the column
          const emptyCellsPadding = Array.from<undefined>({
            length: 3 - nonEmptyCells.length
          })
          return nonEmptyCells.concat(emptyCellsPadding)
        }
        return column
      })
    })
  }

  function removeFromColumn(index: number) {
    setColumns((previous) => {
      return previous.map((column, colIndex) => {
        if (index === colIndex) {
          const nonEmptyCells = column.filter((v) => v !== undefined)
          // Checking that there are some values in the column
          if (nonEmptyCells.length === 0) {
            return column
          }
          // Pop the last value
          nonEmptyCells.pop()
          // Generates padding of empty values to keep 3 cells in the column
          const emptyCellsPadding = Array.from<undefined>({
            length: 3 - nonEmptyCells.length
          })
          return nonEmptyCells.concat(emptyCellsPadding)
        }
        return column
      })
    })
  }

  return (
    <div className='grid aspect-square h-2/5 grid-cols-3 border'>
      {columns.map((column, colIndex) => (
        <Column
          key={colIndex}
          onClick={
            !readonly
              ? (e) => {
                  // Temporary, removing a dice is not a player choice
                  if (e.shiftKey) {
                    removeFromColumn(colIndex)
                  } else {
                    addToColumn(getRandomValue(1, 6), colIndex)
                  }
                }
              : undefined
          }
        >
          {column.map((value, cellIndex) => (
            <Cell key={cellIndex}>
              {value !== undefined && <Dice value={value} />}
            </Cell>
          ))}
        </Column>
      ))}
    </div>
  )
}
