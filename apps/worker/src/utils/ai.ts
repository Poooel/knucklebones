import { countDiceInColumn, getColumnScore, Player } from '@knucklebones/common'

interface Move {
  gain: number
  risk: number
  score: number
}

const WORST_MOVE: Move = {
  gain: Number.MIN_SAFE_INTEGER,
  risk: Number.MAX_SAFE_INTEGER,
  score: Number.MIN_SAFE_INTEGER
}

export function computeScoresForAi(
  playerOne: Player,
  playerTwo: Player,
  nextDice: number
) {
  const scorePerColumns: Move[] = []

  console.log('Computing scores for next move for: ', playerOne.id)

  playerOne.columns.forEach((_, index) => {
    console.log('Column: ', index + 1)
    if (playerOne.columns[index].length !== 3) {
      const scoreForColumn = computeScoreForColumn(
        playerOne,
        playerTwo,
        index,
        nextDice
      )
      scorePerColumns.push(scoreForColumn)
    } else {
      console.log('Column is full')
      scorePerColumns.push(WORST_MOVE)
    }
    console.log()
  })

  console.log(
    'Recommended offensive move: ',
    findRecommendedMove(scorePerColumns, 'offensive')
  )
  console.log(
    'Recommended defensive move: ',
    findRecommendedMove(scorePerColumns, 'defensive')
  )

  return scorePerColumns.map((item) =>
    item.score === Number.MIN_SAFE_INTEGER ? NaN : item.score
  )
}

// offensive: optimize gain; defensive: optimize risk
function findRecommendedMove(
  scorePerColumns: Move[],
  strategy: 'offensive' | 'defensive'
): Move {
  const recommendedMove = scorePerColumns.reduce((max, current) =>
    current.score > max.score ? current : max
  )
  // const recommendedMove = optimize(scorePerColumns, 'score', 'maximize')
  const duplicates = scorePerColumns.filter(
    (value) => value.score === recommendedMove.score
  )

  if (duplicates.length > 1) {
    if (strategy === 'offensive') {
      return duplicates.reduce((max, current) =>
        current.gain > max.gain ? current : max
      )
      // return optimize(duplicates, 'gain', 'maximize')
    } else {
      return duplicates.reduce((min, current) =>
        current.risk < min.risk ? current : min
      )
      // return optimize(duplicates, 'gain', 'minimize')
    }
  } else {
    return recommendedMove
  }
}

function optimize<T extends Object>(
  array: T[],
  key: keyof T,
  strategy: 'minimize' | 'maximize'
) {
  return array.reduce((acc, current) => {
    if (strategy === 'minimize') {
      return current[key] < acc[key] ? current : acc
    } else {
      return current[key] > acc[key] ? current : acc
    }
  })
}

function computeScoreForColumn(
  playerOne: Player,
  playerTwo: Player,
  columnIndex: number,
  nextDice: number
) {
  const gain = computeGain(playerOne, playerTwo, columnIndex, nextDice)
  const risk = computeRisk(playerOne, playerTwo, columnIndex)

  console.log(`Perceived gain is: ${gain} -- risk is: ${risk}`)

  return { gain, risk, score: gain - risk }
}

function computeGain(
  playerOne: Player,
  playerTwo: Player,
  columnIndex: number,
  nextDice: number
) {
  const playerOneColumn = playerOne.columns[columnIndex]
  const playerOneNewColumn = playerOneColumn.concat(nextDice)

  const playerOneScore = getColumnScore(playerOneColumn)
  const playerOneNewScore = getColumnScore(playerOneNewColumn)

  const playerOneScoreDifference = playerOneNewScore - playerOneScore

  const playerTwoCurrentColumn = playerTwo.columns[columnIndex]
  const playerTwoNewColumn = playerTwoCurrentColumn.filter(
    (dice) => dice !== nextDice
  )

  const playerTwoCurrentScore = getColumnScore(playerTwoCurrentColumn)
  const playerTwoNewScore = getColumnScore(playerTwoNewColumn)

  const playerTwoScoreDifference = playerTwoCurrentScore - playerTwoNewScore

  const openSlots = 2 - playerOne.columns[columnIndex].length

  return playerOneScoreDifference + playerTwoScoreDifference + openSlots
}

function computeRisk(
  playerOne: Player,
  playerTwo: Player,
  columnIndex: number
) {
  const riskFromPlayerOneColumn = findMaxInMapValues(
    countDiceInColumn(playerOne.columns[columnIndex])
  )
  const riskFromPlayerTwoColumn = 3 - playerTwo.columns[columnIndex].length
  const riskFromScoreDifference = compareScores(
    playerOne,
    playerTwo,
    columnIndex
  )

  console.log(
    'Perceived risk from player one column is: ',
    riskFromPlayerOneColumn
  )
  console.log(
    'Perceived risk from player two column is: ',
    riskFromPlayerTwoColumn
  )
  console.log(
    'Perceived risk from score difference is: ',
    riskFromScoreDifference
  )

  const risk = Math.max(
    1,
    riskFromPlayerOneColumn + riskFromPlayerTwoColumn + riskFromScoreDifference
  )

  return risk
}

function findMaxInMapValues(map: Map<number, number>) {
  let max = 0

  map.forEach((value) => {
    if (value > max) {
      max = value
    }
  })

  return max
}

function compareScores(
  playerOne: Player,
  playerTwo: Player,
  columnIndex: number
) {
  const playerOneScore = getColumnScore(playerOne.columns[columnIndex])
  const playerTwoScore = getColumnScore(playerTwo.columns[columnIndex])

  if (playerOneScore > playerTwoScore) {
    return 1
  } else if (playerOneScore < playerTwoScore) {
    return -1
  } else {
    return 0
  }
}

// round to 2 decimal places: 1.3456 -> 1.35
function round(number: number) {
  return Math.round((number + Number.EPSILON) * 100) / 100
}
