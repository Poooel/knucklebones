import { countDiceInColumn } from './count'

export function getColumnScore(column: number[]) {
  const countedDice = countDiceInColumn(column)

  return [...countedDice.entries()].reduce((acc, [dice, count]) => {
    return acc + getDiceScore(dice, count)
  }, 0)
}

function getDiceScore(dice: number, count: number) {
  return dice * Math.pow(count, 2)
}
