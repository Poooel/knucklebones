import { GameState } from '../types/gameState'
import { countDiceInColumn } from '../utils/count'
import { Play } from '../types/play'
import { Player } from '../types/player'
import { GameOutcome } from '../types/gameOutcome'
import { getRandomDice, getRandomValue } from './random'

export const emptyGameState: GameState = {
  logs: [],
  gameOutcome: 'not-started',
  rematchVote: []
}

export function initialPlayerState(
  playerId: string,
  displayName?: string
): Player {
  return {
    id: playerId,
    columns: [[], [], []],
    score: 0,
    scorePerColumn: [0, 0, 0],
    displayName
  }
}

function now(): number {
  return Math.floor(Date.now() / 1000)
}

export function initializePlayers(
  gameState: GameState,
  clientId: string,
  displayName?: string
): GameState {
  if (gameState.gameOutcome !== 'not-started') {
    return gameState
  }

  if (gameState.playerOne === undefined) {
    gameState.playerOne = initialPlayerState(clientId, displayName)
    addLog(gameState, `${displayName ?? clientId} has connected to the game`)
  } else if (
    gameState.playerTwo === undefined &&
    clientId !== gameState.playerOne.id
  ) {
    gameState.playerTwo = initialPlayerState(clientId, displayName)
    addLog(gameState, `${displayName ?? clientId} has connected to the game`)

    const isPlayerOneStarting = getRandomValue() > 0.5
    if (isPlayerOneStarting) {
      gameState.nextPlayer = gameState.playerOne
      gameState.playerOne.dice = getRandomDice()
    } else {
      gameState.nextPlayer = gameState.playerTwo
      gameState.playerTwo.dice = getRandomDice()
    }
    gameState.gameOutcome = 'ongoing'
    addLog(
      gameState,
      `${
        gameState.nextPlayer.displayName ?? gameState.nextPlayer.id
      } is going to play first`
    )
  }

  return gameState
}

export function addLog(gameState: GameState, log: string) {
  gameState.logs.push({
    timestamp: now(),
    content: log
  })
}

export function mutateGameState(
  play: Play,
  clientId: string,
  gameState: GameState
): GameState {
  const copiedGameState = structuredClone(gameState)

  const [playerOne, playerTwo] = getPlayers(clientId, copiedGameState)

  placeDice(playerOne, play, copiedGameState)

  removeFromPlayerTwoColumns(play, playerTwo)

  updateScores(copiedGameState)

  if (isBoardFull(playerOne)) {
    copiedGameState.gameOutcome = computeGameOutcome(
      playerOne,
      playerTwo,
      copiedGameState
    )
  } else {
    playerOne.dice = undefined
    playerTwo.dice = getRandomDice()
    copiedGameState.nextPlayer = playerTwo
    addLog(
      copiedGameState,
      `${playerTwo.displayName ?? playerTwo.id} is going to play next with a ${
        playerTwo.dice
      }`
    )
  }

  return copiedGameState
}

function getPlayers(clientId: string, gameState: GameState): [Player, Player] {
  if (clientId === gameState.playerOne?.id) {
    return [gameState.playerOne, gameState.playerTwo!]
  } else if (clientId === gameState.playerTwo?.id) {
    return [gameState.playerTwo, gameState.playerOne!]
  } else {
    throw new Error('Unexpected playerId received.')
  }
}

function placeDice(player: Player, play: Play, gameState: GameState) {
  player.columns[play.column].push(play.value)
  addLog(
    gameState,
    `${player.displayName ?? player.id} placed a dice in column ${
      play.column + 1
    } with a value of ${play.value}`
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
    addLog(
      gameState,
      `${playerOne.displayName ?? playerOne.id} wins with a score of ${
        playerOne.score
      }`
    )
    return isPlayerOneReallyPlayerOne(playerOne, gameState)
      ? 'player-one-win'
      : 'player-two-win'
  } else if (playerOne.score < playerTwo.score) {
    addLog(
      gameState,
      `${playerTwo.displayName ?? playerTwo.id} wins with a score of ${
        playerTwo.score
      }`
    )
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
