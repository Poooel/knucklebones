import { countDiceInColumn, getColumnScore, Player } from '@knucklebones/common'
import { status } from 'itty-router-extras'

interface Move {
  gain: number
  risk: number
  score: number
}

type MoveArray = Array<Move | null>

export function computeScoresForAi(
  playerOne: Player,
  playerTwo: Player,
  nextDice: number
) {
  const scorePerColumns: MoveArray = []

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
      scorePerColumns.push(null)
    }
    console.log()
  })

  console.log('Recommended move: ')

  console.log()

  return scorePerColumns
}

function findRecommendedMove(scorePerColumns: MoveArray) {
  const strategy = 'offensive' // optimize gain

  const recommendedMove = Math.max(
    ...scorePerColumns.map((value) => value?.score ?? 0)
  )
  const duplicates = scorePerColumns.filter(
    (value) => value?.score === recommendedMove
  )

  if (duplicates.length > 1) {
    if (strategy === 'offensive') {
      return Math.max(...duplicates.map((value) => value?.gain ?? 0))
    }
  } else {
    return recommendedMove
  }
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
