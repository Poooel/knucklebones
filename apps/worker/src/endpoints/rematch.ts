import { GameState, Player } from '@knucklebones/common'
import { error, status } from 'itty-router-extras'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { BaseRequestWithProps } from '../types/itty'
import { makeAiPlay } from '../utils/ai'
import {
  broadcastGameState,
  getGameState,
  saveGameState
} from '../utils/endpoints'

export async function rematch(
  request: BaseRequestWithProps,
  cloudflareEnvironment: CloudflareEnvironment,
  context: ExecutionContext
) {
  const gameState = await getGameState(request)

  if (gameState.outcome === 'ongoing') {
    return error(400, "The game is still ongoing. Can't rematch.")
  }

  if (
    (gameState.rematchVote === undefined && gameState.playerTwo.isAi()) || // Player one vote for rematch and player two is AI
    (gameState.rematchVote !== undefined && // A player already voted for rematch and the other player is voting as well
      gameState.rematchVote !== request.playerId)
  ) {
    const newGameState = new GameState(
      new Player(gameState.playerOne.id, gameState.playerOne.displayName),
      new Player(
        gameState.playerTwo.id,
        gameState.playerTwo.displayName,
        gameState.playerTwo.difficulty
      )
    )
    newGameState.initialize()
    newGameState.spectators = gameState.spectators

    await saveGameState(newGameState, request)
    await broadcastGameState(newGameState, request, cloudflareEnvironment)

    if (
      newGameState.playerTwo.isAi() &&
      newGameState.nextPlayer.equals(newGameState.playerTwo)
    ) {
      makeAiPlay(newGameState, request, cloudflareEnvironment, context)
    }
  } else if (gameState.rematchVote === undefined) {
    gameState.rematchVote = request.playerId
    await saveGameState(gameState, request)
    await broadcastGameState(gameState, request, cloudflareEnvironment)
  }

  return status(200)
}
