import { emptyGameState, initializePlayers } from '@knucklebones/common'
import { error } from 'itty-router-extras'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { RequestWithProps } from '../types/itty'
import { getGameState, saveAndPropagate } from '../utils/endpoints'

export async function rematch(
  request: RequestWithProps,
  cloudflareEnvironment: CloudflareEnvironment
): Promise<Response> {
  const gameState = await getGameState(request)

  let mutatedGameState = gameState

  if (
    mutatedGameState.gameOutcome === 'ongoing' ||
    mutatedGameState.gameOutcome === 'not-started'
  ) {
    return error(400, "The game is still ongoing. Can't rematch.")
  }

  if (!mutatedGameState.rematchVote.includes(request.playerId!)) {
    mutatedGameState.rematchVote.push(request.playerId!)
  }

  const { playerOne, playerTwo } = mutatedGameState

  if (
    mutatedGameState.rematchVote.includes(playerOne!.id) &&
    mutatedGameState.rematchVote.includes(playerTwo!.id)
  ) {
    mutatedGameState = emptyGameState
    initializePlayers(mutatedGameState, playerOne!.id, playerOne?.displayName)
    initializePlayers(mutatedGameState, playerTwo!.id, playerTwo?.displayName)
  }

  return await saveAndPropagate(
    mutatedGameState,
    request,
    cloudflareEnvironment
  )
}
