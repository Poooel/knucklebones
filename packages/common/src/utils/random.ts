export function getRandomValue(min = 0, max = 1) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

export function coinflip() {
  return Math.random() > 0.5
}

export function getRandomDice() {
  return getRandomValue(1, 6)
}
