import { Env } from '../types/env'
import { GameState } from 'knucklebones-common/src/types/gameState'
import { countDiceInColumn } from 'knucklebones-common/src/utils/count'
import { Play } from 'knucklebones-common/src/types/play'
import { Player } from 'knucklebones-common/src/types/player'
import { GameOutcome } from 'knucklebones-common/src/types/gameOutcome'
import { getRandomDice } from './random'
import { sendStateThroughAbly } from './ably'
import { now } from './timestamp'

const emptyGameState: GameState = {
  logs: [],
  gameOutcome: 'not-started'
}

export function initialPlayerState(playerId: string): Player {
  return {
    id: playerId,
    columns: [[], [], []],
    score: 0,
    scorePerColumn: [0, 0, 0]
  }
}

export async function getGameState(roomId: string, env: Env) {
  return (
    (await env.GAME_STATE_STORE.get<GameState>(roomId, {
      type: 'json'
    })) ?? emptyGameState
  )
}

export async function saveAndPropagateState(
  env: Env,
  roomId: string,
  gameState: GameState
) {
  await env.GAME_STATE_STORE.put(roomId, JSON.stringify(gameState), {
    expirationTtl: 86400
  })

  await sendStateThroughAbly(gameState, env, roomId)
}

export function addLog(gameState: GameState, log: string) {
  gameState.logs.push({
    timestamp: now(),
    content: log
  })
}

export function mutateGameState(play: Play, gameState: GameState): GameState {
  const [playerOne, playerTwo] = getPlayers(play, gameState)

  placeDice(playerOne, play, gameState)

  removeFromPlayerTwoColumns(play, playerTwo)

  updateScores(gameState)

  if (isBoardFull(playerOne)) {
    gameState.gameOutcome = computeGameOutcome(playerOne, playerTwo, gameState)
  } else {
    playerOne.dice = undefined
    playerTwo.dice = getRandomDice()
    gameState.nextPlayer = playerTwo.id
    addLog(
      gameState,
      `${playerTwo.id} is going to play next with a ${playerTwo.dice}`
    )
  }

  return gameState
}

function getPlayers(play: Play, gameState: GameState): [Player, Player] {
  if (play.playerId === gameState.playerOne?.id) {
    return [gameState.playerOne, gameState.playerTwo!]
  } else if (play.playerId === gameState.playerTwo?.id) {
    return [gameState.playerTwo, gameState.playerOne!]
  } else {
    throw new Error('Unexpected playerId received.')
  }
}

function placeDice(player: Player, play: Play, gameState: GameState) {
  player.columns[play.column].push(play.value)
  addLog(
    gameState,
    `${player.id} placed a dice in column ${play.column + 1} with a value of ${
      play.value
    }`
  )
}

function removeFromPlayerTwoColumns(play: Play, playerTwo: Player) {
  playerTwo.columns = playerTwo.columns.map((column, colIndex) => {
    if (colIndex === play.column) {
      return column.filter((dice) => dice !== play.value)
    }
    return column
  })
}

function isBoardFull(player: Player): boolean {
  return player.columns.flat().length === 9
}

function updateScores(gameState: GameState) {
  updateScore(gameState.playerOne!)
  updateScore(gameState.playerTwo!)
}

function updateScore(player: Player) {
  const scorePerColumn = player.columns.map((column) => {
    const countedDice = countDiceInColumn(column)
    return getColumnScore(countedDice)
  })
  const score = scorePerColumn.reduce((acc, total) => acc + total, 0)

  player.scorePerColumn = scorePerColumn
  player.score = score
}

function getColumnScore(countedDice: Map<number, number>) {
  return [...countedDice.entries()].reduce((acc, [dice, count]) => {
    return acc + getDiceScore(dice, count)
  }, 0)
}

function getDiceScore(dice: number, count: number) {
  return dice * Math.pow(count, 2)
}

function computeGameOutcome(
  playerOne: Player,
  playerTwo: Player,
  gameState: GameState
): GameOutcome {
  if (playerOne.score > playerTwo.score) {
    addLog(gameState, `${playerOne.id} wins with a score of ${playerOne.score}`)
    return isPlayerOneReallyPlayerOne(playerOne, gameState)
      ? 'player-one-win'
      : 'player-two-win'
  } else if (playerOne.score < playerTwo.score) {
    addLog(gameState, `${playerTwo.id} wins with a score of ${playerTwo.score}`)
    return isPlayerOneReallyPlayerOne(playerOne, gameState)
      ? 'player-two-win'
      : 'player-one-win'
  } else {
    addLog(
      gameState,
      `It's a tie! Both players have a score of ${playerOne.score}`
    )
    return 'tie'
  }
}

function isPlayerOneReallyPlayerOne(
  playerOne: Player,
  gameState: GameState
): boolean {
  return playerOne.id === gameState.playerOne?.id
}
