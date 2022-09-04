type CountedDice = Map<number, number>
export type ColumnDice = number[]
export type BoardDice = ColumnDice[]

function getDieScore(die: number, count: number) {
  return die * Math.pow(count, 2)
}

function countDiceInColumn(column: ColumnDice) {
  return column.reduce<CountedDice>((map, die = 0) => {
    const dieCount = map.get(die)
    if (dieCount !== undefined) {
      return map.set(die, dieCount + 1)
    }
    return map.set(die, 1)
  }, new Map())
}

function getColumnScore(countedDice: CountedDice) {
  return [...countedDice.entries()].reduce((acc, [die, count]) => {
    return acc + getDieScore(die, count)
  }, 0)
}

/**
 * Helper function to compute the score of a board, per column. The total can
 * be found by adding the score of each column.
 * All dice in a column are summed up. If the same dice is found twice, we sum
 * they up and multiply the result by 2. If the same dice is found 3 times, we
 * sum they up and multiply th result by 3.
 */
export function getScore(dice: BoardDice) {
  const scorePerColumn = dice.map((column) => {
    const countedDice = countDiceInColumn(column)
    return {
      countedDice,
      total: getColumnScore(countedDice)
    }
  })
  return {
    scorePerColumn,
    totalScore: scorePerColumn.reduce((acc, { total }) => acc + total, 0)
  }
}
