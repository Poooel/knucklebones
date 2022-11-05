import {
  emptyGameState,
  initializePlayers,
  mutateGameState
} from '@knucklebones/common'
import { error, status } from 'itty-router-extras'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { BaseRequestWithProps } from '../types/itty'
import { getNextMove, makeAiPlay } from '../utils/ai'
import { getGameState, saveAndPropagate } from '../utils/endpoints'

export async function rematch(
  request: BaseRequestWithProps,
  cloudflareEnvironment: CloudflareEnvironment,
  context: ExecutionContext
) {
  const gameState = await getGameState(request)

  let mutatedGameState = gameState

  if (
    mutatedGameState.gameOutcome === 'ongoing' ||
    mutatedGameState.gameOutcome === 'not-started'
  ) {
    return error(400, "The game is still ongoing. Can't rematch.")
  }

  if (!mutatedGameState.rematchVote.includes(request.playerId)) {
    mutatedGameState.rematchVote.push(request.playerId)
  }

  const { playerOne, playerTwo } = mutatedGameState

  if (
    (mutatedGameState.rematchVote.includes(playerOne!.id) &&
      mutatedGameState.rematchVote.includes(playerTwo!.id)) ||
    (mutatedGameState.rematchVote.includes(playerOne!.id) &&
      mutatedGameState.playingAgainstAi)
  ) {
    mutatedGameState = emptyGameState
    initializePlayers(mutatedGameState, playerOne!.id, playerOne?.displayName)
    initializePlayers(mutatedGameState, playerTwo!.id, playerTwo?.displayName)

    if (gameState.playingAgainstAi) {
      mutatedGameState.playingAgainstAi = true
      mutatedGameState.aiDifficulty = gameState.aiDifficulty

      if (mutatedGameState.nextPlayer!.id === mutatedGameState.playerTwo!.id) {
        makeAiPlay(mutatedGameState, request, cloudflareEnvironment, context)
      }
    }
  }

  await saveAndPropagate(mutatedGameState, request, cloudflareEnvironment)

  return status(200)
}
