import { initializePlayers } from '@knucklebones/common'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { RequestWithProps } from '../types/itty'
import { fetchResources, saveAndPropagate } from '../utils/endpoints'

export async function init(
  request: RequestWithProps,
  cloudflareEnvironment: CloudflareEnvironment
): Promise<Response> {
  console.log('received request in endpoint')

  const { roomId, gameStateStore, gameState } = await fetchResources(request)

  console.log('fetched resources')

  const displayName = request.query?.displayName
  const initializedGameState = initializePlayers(
    gameState,
    request.playerId!,
    displayName
  )

  return await saveAndPropagate(
    initializedGameState,
    gameStateStore,
    roomId,
    cloudflareEnvironment
  )
}
