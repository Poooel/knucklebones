import { error, status } from 'itty-router'
import { type CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { type BaseRequestWithProps } from '../types/itty'
import {
  broadcastGameState,
  getGameState,
  saveGameState
} from '../utils/endpoints'

export async function deleteDisplayName(
  request: BaseRequestWithProps,
  cloudflareEnvironment: CloudflareEnvironment
) {
  const gameState = await getGameState(request)

  if (gameState.playerOne?.id === request.playerId) {
    gameState.playerOne.displayName = undefined
  } else if (gameState.playerTwo?.id === request.playerId) {
    gameState.playerTwo.displayName = undefined
  } else {
    return error(400, 'Unexpected playerId received.')
  }

  await saveGameState(gameState, request)
  await broadcastGameState(gameState, request, cloudflareEnvironment)

  return status(200)
}
