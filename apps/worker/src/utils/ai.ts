import { countDiceInColumn, getColumnScore, Player } from '@knucklebones/common'
import { getMaxBy, getMinBy } from './array'

interface Move {
  gain: number
  risk: number
  score: number
  columnIndex: number
  nextDice: number
}

const WORST_MOVE: Move = {
  gain: Number.MIN_SAFE_INTEGER,
  risk: Number.MAX_SAFE_INTEGER,
  score: Number.MIN_SAFE_INTEGER,
  columnIndex: -1,
  nextDice: -1
}

type Difficulty = 'easy' | 'normal' | 'hard'

type Strategy = 'defensive' | 'offensive'

export function getNextMove(
  playerOne: Player,
  playerTwo: Player,
  nextDice: number,
  difficulty: Difficulty
) {
  const scoredMoves = evaluateMoves(playerOne, playerTwo, nextDice)

  if (playerOne.score > playerTwo.score) {
    return getBestMove(scoredMoves, 'defensive')
  } else {
    return getBestMove(scoredMoves, 'offensive')
  }
}

function getBestMove(scoredMoves: Move[], strategy: Strategy): Move {
  const recommendedMove = getMaxBy(scoredMoves, 'score')

  const duplicateMoves = scoredMoves.filter(
    (value) => value.score === recommendedMove.score
  )

  if (duplicateMoves.length > 1) {
    if (strategy === 'offensive') {
      return getMaxBy(duplicateMoves, 'gain')
    } else {
      return getMinBy(duplicateMoves, 'risk')
    }
  } else {
    return recommendedMove
  }
}

function evaluateMoves(playerOne: Player, playerTwo: Player, nextDice: number) {
  const scoredMoves: Move[] = []

  playerOne.columns.forEach((_, columnIndex) => {
    if (playerOne.columns[columnIndex].length !== 3) {
      const scoredMove = evaluateMoveScoreInColumn(
        playerOne,
        playerTwo,
        columnIndex,
        nextDice
      )
      scoredMoves.push(scoredMove)
    } else {
      scoredMoves.push(WORST_MOVE)
    }
  })

  return scoredMoves
}

function evaluateMoveScoreInColumn(
  playerOne: Player,
  playerTwo: Player,
  columnIndex: number,
  nextDice: number
) {
  const gain = computeGain(playerOne, playerTwo, columnIndex, nextDice)
  const risk = computeRisk(playerOne, playerTwo, columnIndex)
  const score = gain - risk

  return { gain, risk, score, columnIndex, nextDice }
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

  return (
    riskFromPlayerOneColumn + riskFromPlayerTwoColumn + riskFromScoreDifference
  )
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
