type CountedDice = Map<number, number>
export type MaybeDice = number | undefined
// export type ColumnDice = [MaybeDice, MaybeDice, MaybeDice]
// export type BoardDice = [ColumnDice, ColumnDice, ColumnDice]
export type ColumnDice = MaybeDice[]
export type BoardDice = ColumnDice[]

// There's a way to sum everything up in one iteration, but lazy
function countDice(dice: MaybeDice[]) {
  return dice.reduce<CountedDice>((map, die = 0) => {
    const diceEntry = map.get(die)
    if (diceEntry !== undefined) {
      return map.set(die, diceEntry + 1)
    }
    return map.set(die, 1)
  }, new Map())
}

function getColumnScore(dice: ColumnDice) {
  let result = 0
  for (const [die, count] of countDice(dice)) {
    result += die * Math.pow(count, 2)
  }
  return result
}

export function getScore(dice: BoardDice) {
  return dice.map((column) => {
    return getColumnScore(column)
  })
}
