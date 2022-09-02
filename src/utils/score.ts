type CountedDice = Map<number | 'total', number>
export type MaybeDice = number | undefined
export type ColumnDice = MaybeDice[]
export type BoardDice = ColumnDice[]

function getDieScore(die: number, count: number) {
  return die * Math.pow(count, 2)
}

function getColumnScore(dice: ColumnDice) {
  return (
    dice
      // In this loop, we count each encountered die and maintain the total
      // at the same time (O(n)). To maintain the total properly, when we find
      // a duplicate die, we need to resolve how much it contributed to the
      // total, substract it, and then add the updated contribution based on the
      // new count.
      .reduce<CountedDice>((map, die = 0) => {
        const dieCount = map.get(die)
        const total = map.get('total') ?? 0
        // Die already found
        if (dieCount !== undefined) {
          // Getting the current contribution to the total score
          const currrentDieScore = getDieScore(die, dieCount)
          // Getting the contribution to the total score counting for the new die
          const nextDieScore = getDieScore(die, dieCount + 1)
          return (
            map
              .set(die, dieCount + 1)
              // Adjusting the total with the correct die count
              .set('total', total - currrentDieScore + nextDieScore)
          )
        }
        return map.set(die, 1).set('total', total + die)
      }, new Map())
      .get('total') ?? 0
  )
}

/**
 * Helper function to compute the score of a board, per column. The total can
 * be found by adding the score of each column.
 * All dice in a column are summed up. If the same dice is found twice, we sum
 * they up and multiply the result by 2. If the same dice is found 3 times, we
 * sum they up and multiply th result by 3.
 */
export function getScore(dice: BoardDice) {
  return dice.map((column) => {
    return getColumnScore(column)
  })
}
