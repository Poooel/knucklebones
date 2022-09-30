import { Env } from '../../types/env'
import { jsonResponse } from '../../utils/jsonResponse'
import { Play } from '../../../shared/types/play'
import {
  getGameState,
  mutateGameState,
  saveAndPropagateState
} from '../../utils/gameState'
import { getRoomId } from '../../utils/params'
import Toucan from 'toucan-js'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request, params, data } = context

  const roomId = getRoomId(params)

  const play = await request.json<Play>()

  const sentry = data.sentry as Toucan

  sentry.setRequestBody(play)

  const gameState = await getGameState(roomId, env)

  sentry.setExtra('previousGameState', gameState)

  const mutatedGameState = mutateGameState(play, gameState)

  sentry.setExtra('mutatedGameState', mutatedGameState)

  await saveAndPropagateState(env, roomId, mutatedGameState)

  return jsonResponse(mutatedGameState, { status: 200 })
}
