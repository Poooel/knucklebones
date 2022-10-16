import { mutateGameState, Play } from '@knucklebones/common'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { RequestWithProps } from '../types/itty'
import { getGameState, saveAndPropagate } from '../utils/endpoints'

export async function play(
  request: RequestWithProps,
  cloudflareEnvironment: CloudflareEnvironment
): Promise<Response> {
  const gameState = await getGameState(request)

  const play = request.content! as Play
  const mutatedGameState = mutateGameState(play, request.playerId!, gameState)

  return await saveAndPropagate(
    mutatedGameState,
    request,
    cloudflareEnvironment
  )
}
