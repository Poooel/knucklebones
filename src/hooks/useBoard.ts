import * as React from 'react'
import { ColumnDice } from '../utils/score'

interface UseBoardProps {
  onDicePlaced?(column: number, value: number): void
  onBoardFull(): void
}

const MAX_COLUMNS = 3
const MAX_CELLS_PER_COLUMNS = 3

export function useBoard({ onDicePlaced, onBoardFull }: UseBoardProps) {
  const [columns, setColumns] = React.useState(
    Array.from<ColumnDice>({ length: MAX_COLUMNS }).fill([])
  )

  React.useEffect(() => {
    if (columns.flat().length === MAX_COLUMNS * MAX_CELLS_PER_COLUMNS) {
      onBoardFull()
    }
  }, [columns])

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

  function removeDiceFromColumn(index: number, value: number) {
    setColumns((previous) => {
      const next = previous.map((column, colIndex) => {
        if (colIndex === index) {
          return column.filter((dice) => dice !== value)
        }
        return column
      })
      return next
    })
  }

  return {
    columns,
    addToColumn,
    removeDiceFromColumn
  }
}
