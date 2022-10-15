import { DisplayNameUpdate } from '@knucklebones/common'
import { error } from 'itty-router-extras'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { RequestWithProps } from '../types/itty'
import { fetchResources, saveAndPropagate } from '../utils/endpoints'

export async function displayName(
  request: RequestWithProps,
  cloudflareEnvironment: CloudflareEnvironment
): Promise<Response> {
  const { roomId, gameStateStore, gameState, url } = await fetchResources(
    request
  )

  const displayNameUpdate = request.content! as DisplayNameUpdate

  if (gameState.playerOne?.id === request.playerId!) {
    gameState.playerOne.displayName = displayNameUpdate.displayName
  } else if (gameState.playerTwo?.id === request.playerId) {
    gameState.playerTwo!.displayName = displayNameUpdate.displayName
  } else {
    return error(400, 'Unexpected playerId received.')
  }

  return await saveAndPropagate(
    gameState,
    gameStateStore,
    roomId,
    cloudflareEnvironment,
    url
  )
}
