import { writeFileSync } from 'fs'

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function toCSV(data: object[]) {
  return data.reduce((acc, entry) => {
    if (acc === '') {
      for (const key of Object.keys(entry)) {
        acc += `${key},`
      }
      acc += '\n'
    }
    for (const value of Object.values(entry)) {
      acc += `${value},`
    }
    acc += '\n'
    return acc
  }, '')
}

function computeQuartile(q: number, values: number[]) {
  if (!Number.isInteger(q) || q < 1 || q > 100) {
    throw new Error(`Invalid quartile ${q}`)
  }
  // Ideally should not sort within this function
  const sorted = Array.from(values).sort((a, b) => a - b)
  const quartile = sorted.length * (q / 100)
  if (Number.isInteger(quartile)) {
    return sorted[quartile]
  } else {
    const lowQuartile = Math.floor(quartile)
    const highQuartile = Math.ceil(quartile)
    return (sorted[lowQuartile] + sorted[highQuartile]) / 2
  }
}

function computeAverage(values: number[]) {
  return values.reduce((acc, value) => acc + value, 0) / values.length
}

function computeVariance(values: number[], average = computeAverage(values)) {
  return (
    values.reduce((acc, value) => acc + (value - average) ** 2, 0) /
    values.length
  )
}

function computeStandardDeviation(
  values: number[],
  average = computeAverage(values)
) {
  return Math.sqrt(computeVariance(values, average))
}

function getMaxOccurrences(values: number[]) {
  const map = new Map<number, number>()
  let max = [0, 0]
  for (const value of values) {
    const occ = (map.get(value) ?? 0) + 1
    if (occ > max[1]) {
      max = [value, occ]
    }
    map.set(value, occ)
  }
  return max[1]
}

function computeStats(dice: number[]) {
  const median = computeQuartile(50, dice)
  const average = computeAverage(dice)
  const variance = computeVariance(dice)
  const standardDeviation = computeStandardDeviation(dice)
  const maxOccurrences = getMaxOccurrences(dice)
  return {
    median,
    average,
    variance,
    standardDeviation,
    maxOccurrences
  }
}

function computeQuartiles(stats: Array<ReturnType<typeof computeStats>>) {
  const averages = stats.map((s) => s.average)
  const variances = stats.map((s) => s.variance)
  const standardDeviation = stats.map((s) => s.standardDeviation)

  const quartiles: Array<{
    data: string
    min: number
    q1: number
    q3: number
    max: number
  }> = []
  for (const { data, stat } of [
    { data: 'average', stat: averages },
    { data: 'variance', stat: variances },
    { data: 'standardDeviation', stat: standardDeviation }
  ]) {
    quartiles.push({
      data,
      min: Math.min(...stat),
      q1: computeQuartile(25, stat),
      q3: computeQuartile(75, stat),
      max: Math.max(...stat)
    })
  }

  return quartiles
}

enum GameType {
  Short = 17,
  Medium = 26,
  Long = 34
}

function playGame(gameType: GameType, rollDice: () => number) {
  return Array.from({ length: gameType }).map(() => rollDice())
}

function rollRandomDie() {
  return getRandomIntInclusive(1, 6)
}

function preparePool(occurrences: number) {
  let plays = 0
  const pool: number[] = []
  for (let die = 1; die <= 6; die++) {
    for (let occ = 0; occ < occurrences; occ++) {
      pool.push(die)
    }
  }
  return function () {
    const index = getRandomIntInclusive(0, pool.length - 1)
    const die = pool[index]
    pool.splice(index, 1)
    if (plays === 5) {
      // Simulate removing a die from opponent board
      pool.push(die)
    } else {
      plays++
    }
    return die
  }
}

const randomDiceShortGames = computeQuartiles(
  Array.from({ length: 100 }).map(() => {
    const game = playGame(GameType.Short, rollRandomDie)
    return computeStats(game)
  })
)
const randomDiceMediumGames = computeQuartiles(
  Array.from({ length: 100 }).map(() => {
    const game = playGame(GameType.Medium, rollRandomDie)
    return computeStats(game)
  })
)
const randomDiceLongGames = computeQuartiles(
  Array.from({ length: 100 }).map(() => {
    const game = playGame(GameType.Long, rollRandomDie)
    return computeStats(game)
  })
)
const poolDiceShortGames = computeQuartiles(
  Array.from({ length: 100 }).map(() => {
    const rollDieFromPool = preparePool(3)
    const game = playGame(GameType.Short, rollDieFromPool)
    return computeStats(game)
  })
)
const poolDiceMediumGames = computeQuartiles(
  Array.from({ length: 100 }).map(() => {
    const rollDieFromPool = preparePool(3)
    const game = playGame(GameType.Medium, rollDieFromPool)
    return computeStats(game)
  })
)
const poolDiceLongGames = computeQuartiles(
  Array.from({ length: 100 }).map(() => {
    const rollDieFromPool = preparePool(3)
    const game = playGame(GameType.Long, rollDieFromPool)
    return computeStats(game)
  })
)
const largerPoolDiceShortGames = computeQuartiles(
  Array.from({ length: 100 }).map(() => {
    const rollDieFromPool = preparePool(6)
    const game = playGame(GameType.Short, rollDieFromPool)
    return computeStats(game)
  })
)
const largerPoolDiceMediumGames = computeQuartiles(
  Array.from({ length: 100 }).map(() => {
    const rollDieFromPool = preparePool(6)
    const game = playGame(GameType.Medium, rollDieFromPool)
    return computeStats(game)
  })
)
const largerPoolDiceLongGames = computeQuartiles(
  Array.from({ length: 100 }).map(() => {
    const rollDieFromPool = preparePool(6)
    const game = playGame(GameType.Long, rollDieFromPool)
    return computeStats(game)
  })
)

writeFileSync('randomDiceShortGames.csv', toCSV(randomDiceShortGames))
writeFileSync('randomDiceMediumGames.csv', toCSV(randomDiceMediumGames))
writeFileSync('randomDiceLongGames.csv', toCSV(randomDiceLongGames))
writeFileSync('poolDiceShortGames.csv', toCSV(poolDiceShortGames))
writeFileSync('poolDiceMediumGames.csv', toCSV(poolDiceMediumGames))
writeFileSync('poolDiceLongGames.csv', toCSV(poolDiceLongGames))
writeFileSync('largerPoolDiceShortGames.csv', toCSV(largerPoolDiceShortGames))
writeFileSync('largerPoolDiceMediumGames.csv', toCSV(largerPoolDiceMediumGames))
writeFileSync('largerPoolDiceLongGames.csv', toCSV(largerPoolDiceLongGames))
