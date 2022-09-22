export function getRandomValue(min = 0, max = 1) {
  const rand = self.crypto.getRandomValues(new Uint8Array(1))[0] / 256
  return Math.round(rand * (max - min) + min)
}

export function getRandomDice() {
  return getRandomValue(1, 6)
}
