import { Env } from '../../types/env'
import { jsonResponse } from '../../utils/jsonResponse'
import { Play } from '../../../shared-types/play'
import {
  getGameState,
  mutateGameState,
  saveAndPropagateState
} from '../../utils/gameState'
import { getRoomId } from '../../utils/params'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request, params } = context

  const roomId = getRoomId(params)

  const play = await request.json<Play>()

  const gameState = await getGameState(roomId, env)
  const mutatedGameState = mutateGameState(play, gameState)

  await saveAndPropagateState(env, roomId, mutatedGameState)

  return jsonResponse(mutatedGameState, { status: 200 })
}
