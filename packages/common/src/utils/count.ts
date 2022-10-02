export function countDiceInColumn(column: number[]): Map<number, number> {
  return column.reduce<Map<number, number>>((map, dice = 0) => {
    const diceCount = map.get(dice) ?? 0
    return map.set(dice, diceCount + 1)
  }, new Map())
}
