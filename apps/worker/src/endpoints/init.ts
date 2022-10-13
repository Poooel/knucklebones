import { initializePlayers } from '@knucklebones/common'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { RequestWithProps } from '../types/itty'
import { fetchResources, saveAndPropagate } from '../utils/endpoints'

export async function init(
  request: RequestWithProps,
  cloudflareEnvironment: CloudflareEnvironment
): Promise<Response> {
  const { roomId, gameStateStore, gameState } = await fetchResources(request)

  const displayName = request.query?.displayName
  const initializedGameState = initializePlayers(
    gameState,
    request.playerId!,
    displayName
  )

  return await saveAndPropagate(
    initializedGameState,
    roomId,
    gameStateStore,
    cloudflareEnvironment
  )
}
