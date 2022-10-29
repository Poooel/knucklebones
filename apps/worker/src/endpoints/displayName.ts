import { error, status } from 'itty-router-extras'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { BaseRequestWithProps } from '../types/itty'
import { getGameState, saveAndPropagate } from '../utils/endpoints'

interface DisplayNameRequest extends BaseRequestWithProps {
  displayName: string
}

export async function displayName(
  request: DisplayNameRequest,
  cloudflareEnvironment: CloudflareEnvironment
) {
  const gameState = await getGameState(request)

  if (gameState.playerOne?.id === request.playerId) {
    gameState.playerOne.displayName = request.displayName
  } else if (gameState.playerTwo?.id === request.playerId) {
    gameState.playerTwo.displayName = request.displayName
  } else {
    return error(400, 'Unexpected playerId received.')
  }

  await saveAndPropagate(gameState, request, cloudflareEnvironment)

  return status(200)
}
