import { status } from 'itty-router-extras'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { BaseRequestWithProps } from '../types/itty'
import { makeAiPlay } from '../utils/ai'
import { getGameState, saveAndPropagate } from '../utils/endpoints'

interface PlayRequest extends BaseRequestWithProps {
  dice: number
  column: number
}

export async function play(
  request: PlayRequest,
  cloudflareEnvironment: CloudflareEnvironment,
  context: ExecutionContext
) {
  const gameState = await getGameState(request)

  const play = {
    dice: Number(request.dice),
    column: Number(request.column),
    author: request.playerId
  }

  gameState.play(play)

  await saveAndPropagate(gameState, request, cloudflareEnvironment)

  if (
    gameState.playerTwo.isAi() &&
    gameState.nextPlayer.equals(gameState.playerTwo)
  ) {
    makeAiPlay(gameState, request, cloudflareEnvironment, context)
  }

  return status(200)
}
