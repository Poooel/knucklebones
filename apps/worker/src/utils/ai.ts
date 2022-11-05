import {
  countDiceInColumn,
  Difficulty,
  GameState,
  getColumnScore,
  getRandomValue,
  Player
} from '@knucklebones/common'
import { play } from '../endpoints'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { BaseRequestWithProps } from '../types/itty'
import { getMaxBy, getMinBy } from './array'
import { sleep } from './sleep'

interface Move {
  gain: number
  risk: number
  score: number
  column: number
  dice: number
}

const WORST_MOVE: Move = {
  gain: Number.MIN_SAFE_INTEGER,
  risk: Number.MAX_SAFE_INTEGER,
  score: Number.MIN_SAFE_INTEGER,
  column: -1,
  dice: -1
}

type Strategy = 'defensive' | 'offensive'

export function makeAiPlay(
  gameState: GameState,
  request: BaseRequestWithProps,
  cloudflareEnvironment: CloudflareEnvironment,
  context: ExecutionContext
) {
  const aiPlay = async () => {
    const nextMove = getNextMove(
      gameState.playerTwo!,
      gameState.playerOne!,
      gameState.playerTwo!.dice!,
      gameState.aiDifficulty!
    )

    await sleep(getRandomValue(500, 1000))

    await play(
      {
        column: nextMove.column,
        value: nextMove.dice,
        roomKey: request.roomKey,
        playerId: gameState.playerTwo!.id,
        GAME_STATE_STORE: request.GAME_STATE_STORE
      },
      cloudflareEnvironment,
      context
    )
  }

  context.waitUntil(aiPlay())
}

export function getNextMove(
  ai: Player,
  human: Player,
  dice: number,
  difficulty: Difficulty
) {
  const scoredMoves = evaluateMoves(ai, human, dice)

  if (ai.score > human.score) {
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

function evaluateMoves(ai: Player, human: Player, dice: number) {
  const scoredMoves: Move[] = []

  ai.columns.forEach((_, columnIndex) => {
    if (ai.columns[columnIndex].length !== 3) {
      const scoredMove = evaluateMoveScoreInColumn(ai, human, columnIndex, dice)
      scoredMoves.push(scoredMove)
    } else {
      scoredMoves.push(WORST_MOVE)
    }
  })

  return scoredMoves
}

function evaluateMoveScoreInColumn(
  ai: Player,
  human: Player,
  column: number,
  dice: number
) {
  const gain = computeGain(ai, human, column, dice)
  const risk = computeRisk(ai, human, column)
  const score = gain - risk

  return { gain, risk, score, column, dice }
}

function computeGain(ai: Player, human: Player, column: number, dice: number) {
  const aiColumn = ai.columns[column]

  if (aiColumn.length === 3) {
    return 0
  }

  const aiNewColumn = aiColumn.concat(dice)

  const aiScore = getColumnScore(aiColumn)
  const aiNewScore = getColumnScore(aiNewColumn)

  const aiScoreDifference = aiNewScore - aiScore

  const humanColumn = human.columns[column]
  const humanNewColumn = humanColumn.filter(
    (diceToRemove) => diceToRemove !== dice
  )

  const humanScore = getColumnScore(humanColumn)
  const humanNewScore = getColumnScore(humanNewColumn)

  const humanScoreDifference = humanScore - humanNewScore

  const openSlots = 2 - aiColumn.length

  return aiScoreDifference + humanScoreDifference + openSlots
}

function computeRisk(ai: Player, human: Player, column: number) {
  const riskFromDiceInAiColumn = getMaxInMapValues(
    countDiceInColumn(ai.columns[column])
  )
  const riskFromOpenSlotsInHumanColumn = 3 - human.columns[column].length
  const riskFromScoreDifference = compareScores(ai, human, column)

  return (
    riskFromDiceInAiColumn +
    riskFromOpenSlotsInHumanColumn +
    riskFromScoreDifference
  )
}

function getMaxInMapValues(map: Map<number, number>) {
  let max = 0

  map.forEach((value) => {
    if (value > max) {
      max = value
    }
  })

  return max
}

function compareScores(ai: Player, human: Player, column: number) {
  const aiScore = getColumnScore(ai.columns[column])
  const humanScore = getColumnScore(human.columns[column])

  if (aiScore > humanScore) {
    return 1
  } else if (aiScore < humanScore) {
    return -1
  } else {
    return 0
  }
}
