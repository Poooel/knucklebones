import { getRandomValue, mutateGameState } from '@knucklebones/common'
import { status } from 'itty-router-extras'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { BaseRequestWithProps } from '../types/itty'
import { getNextMove } from '../utils/ai'
import { getGameState, saveAndPropagate } from '../utils/endpoints'
import { sleep } from '../utils/sleep'

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
    const aiPlay = async () => {
      const nextMove = getNextMove(
        mutatedGameState.playerTwo!,
        mutatedGameState.playerOne!,
        mutatedGameState.playerTwo!.dice!,
        mutatedGameState.aiDifficulty!
      )

      await sleep(getRandomValue(500, 1000))

      await play(
        {
          column: nextMove.columnIndex,
          value: nextMove.nextDice,
          roomKey: request.roomKey,
          playerId: mutatedGameState.playerTwo!.id,
          GAME_STATE_STORE: request.GAME_STATE_STORE
        },
        cloudflareEnvironment,
        context
      )
    }

    context.waitUntil(aiPlay())
  }

  return status(200)
}
