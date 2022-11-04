export function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  // The maximum is inclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function coinflip() {
  return Math.random() > 0.5
}

export function getRandomDice() {
  return getRandomIntInclusive(1, 6)
}
