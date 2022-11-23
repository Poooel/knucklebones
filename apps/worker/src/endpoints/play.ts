import { mutateGameState } from '@knucklebones/common'
import { status } from 'itty-router-extras'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { BaseRequestWithProps } from '../types/itty'
import { makeAiPlay } from '../utils/ai'
import { getGameState, saveAndPropagate } from '../utils/endpoints'

interface PlayRequest extends BaseRequestWithProps {
  column: number
  value: number
}

export async function play(
  request: PlayRequest,
  cloudflareEnvironment: CloudflareEnvironment,
  context: ExecutionContext
) {
  const gameState = await getGameState(request)

  const playObject = {
    column: Number(request.column),
    value: Number(request.value)
  }
  const mutatedGameState = mutateGameState(
    playObject,
    request.playerId,
    gameState
  )

  await saveAndPropagate(mutatedGameState, request, cloudflareEnvironment)

  if (
    mutatedGameState.playingAgainstAi &&
    mutatedGameState.nextPlayer!.id === mutatedGameState.playerTwo!.id
  ) {
    makeAiPlay(mutatedGameState, request, cloudflareEnvironment, context)
  }

  return status(200)
}
