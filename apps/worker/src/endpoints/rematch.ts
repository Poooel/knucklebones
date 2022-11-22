import { GameState, Player } from '@knucklebones/common'
import { error, status } from 'itty-router-extras'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { BaseRequestWithProps } from '../types/itty'
import { makeAiPlay } from '../utils/ai'
import { getGameState, saveAndPropagate } from '../utils/endpoints'

export async function rematch(
  request: BaseRequestWithProps,
  cloudflareEnvironment: CloudflareEnvironment,
  context: ExecutionContext
) {
  const gameState = await getGameState(request)

  if (gameState.outcome === 'ongoing' || gameState.outcome === 'not-started') {
    return error(400, "The game is still ongoing. Can't rematch.")
  }

  if (gameState.rematchVote === undefined) {
    gameState.rematchVote = request.playerId
    await saveAndPropagate(gameState, request, cloudflareEnvironment)
  } else {
    const newGameState = new GameState(
      new Player(gameState.playerOne.id, gameState.playerOne.displayName),
      new Player(
        gameState.playerTwo.id,
        gameState.playerTwo.displayName,
        gameState.playerTwo.difficulty
      )
    )
    await saveAndPropagate(newGameState, request, cloudflareEnvironment)

    if (
      newGameState.playerTwo.isAi() &&
      newGameState.nextPlayer.equals(newGameState.playerTwo)
    ) {
      makeAiPlay(newGameState, request, cloudflareEnvironment, context)
    }
  }

  return status(200)
}
