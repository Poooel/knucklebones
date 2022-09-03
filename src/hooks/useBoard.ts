import * as React from 'react'
import { ColumnDice } from '../utils/score'

interface UseBoardProps {
  onDicePlaced?(column: number, value: number): void
}

const MAX_COLUMNS = 3
const MAX_CELLS_PER_COLUMNS = 3

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
    isBoardFull,
    addToColumn,
    removeDiceFromColumn
  }
}
