import { Difficulty, initializePlayers, PlayerType } from '@knucklebones/common'
import { error, status } from 'itty-router-extras'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { BaseRequestWithProps } from '../types/itty'
import { makeAiPlay } from '../utils/ai'
import { getGameState, saveAndPropagate } from '../utils/endpoints'

interface InitRequest extends BaseRequestWithProps {
  playerType: PlayerType
  query?: { displayName: string; difficulty: Difficulty }
}

export async function init(
  request: InitRequest,
  cloudflareEnvironment: CloudflareEnvironment,
  context: ExecutionContext
) {
  const gameState = await getGameState(request)

  switch (request.playerType) {
    case 'ai': {
      if (gameState.playerOne === undefined) {
        return error(400, 'AI can only be player two')
      }

      const initializedGameState = initializePlayers(
        gameState,
        request.playerId,
        `AI (${request.query!.difficulty})`
      )

      initializedGameState.playingAgainstAi = true
      initializedGameState.aiDifficulty = request.query!.difficulty

      await saveAndPropagate(
        initializedGameState,
        request,
        cloudflareEnvironment
      )

      // ai is going to play first after game is initialized
      if (
        initializedGameState.nextPlayer!.id ===
        initializedGameState.playerTwo!.id
      ) {
        makeAiPlay(
          initializedGameState,
          request,
          cloudflareEnvironment,
          context
        )
      }

      break
    }
    case 'human': {
      const initializedGameState = initializePlayers(
        gameState,
        request.playerId,
        request.query?.displayName
      )
      await saveAndPropagate(
        initializedGameState,
        request,
        cloudflareEnvironment
      )
    }
  }

  return status(200)
}
