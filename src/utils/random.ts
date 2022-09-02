export function getRandomValue(min = 0, max = 1) {
  return Math.round(Math.random() * (max - min) + min)
}

export function getRandomDice() {
  return getRandomValue(1, 6)
}
