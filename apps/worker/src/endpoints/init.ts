import { Difficulty, Player } from '@knucklebones/common'
import { status } from 'itty-router-extras'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { BaseRequestWithProps } from '../types/itty'
import { makeAiPlay } from '../utils/ai'
import {
  getGameState,
  getLobby,
  isGameStateInitialized,
  saveAndPropagate,
  saveLobby
} from '../utils/endpoints'

interface InitRequest extends BaseRequestWithProps {
  query?: { displayName: string; difficulty: Difficulty }
}

export async function init(
  request: InitRequest,
  cloudflareEnvironment: CloudflareEnvironment,
  context: ExecutionContext
) {
  if (await isGameStateInitialized(request)) {
    const gameState = await getGameState(request)
    gameState.addSpectator(request.playerId)
    await saveAndPropagate(gameState, request, cloudflareEnvironment)
  } else {
    const lobby = await getLobby(request)

    const player = new Player(
      request.playerId,
      request.query?.displayName,
      request.query?.difficulty
    )

    lobby.addPlayer(player)
    await saveLobby(lobby, request)

    if (lobby.isReady()) {
      const gameState = lobby.toGameState()

      await saveAndPropagate(gameState, request, cloudflareEnvironment)

      if (
        gameState.playerTwo.isAi() &&
        gameState.nextPlayer.equals(gameState.playerTwo)
      ) {
        makeAiPlay(gameState, request, cloudflareEnvironment, context)
      }
    }
  }

  return status(200)
}
