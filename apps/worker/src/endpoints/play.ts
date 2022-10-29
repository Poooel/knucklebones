import { getPlayers, mutateGameState, Play } from '@knucklebones/common'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { RequestWithProps } from '../types/itty'
import { computeScoresForAi } from '../utils/ai'
import { getGameState, saveAndPropagate } from '../utils/endpoints'

export async function play(
  request: RequestWithProps,
  cloudflareEnvironment: CloudflareEnvironment
): Promise<Response> {
  const gameState = await getGameState(request)

  const play = request.content! as Play
  const mutatedGameState = mutateGameState(play, request.playerId!, gameState)

  // temp for AI testing
  const [playerOne, playerTwo] = getPlayers(request.playerId!, mutatedGameState)
  playerOne.scoresForAi = undefined
  playerTwo.scoresForAi = computeScoresForAi(
    playerTwo,
    playerOne,
    playerTwo.dice!
  )
  // temp for AI testing

  return await saveAndPropagate(
    mutatedGameState,
    request,
    cloudflareEnvironment
  )
}
