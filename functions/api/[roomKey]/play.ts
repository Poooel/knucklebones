import { Env } from '../../types/env'
import { jsonResponse } from '../../utils/jsonResponse'
import { Play } from '../../../shared-types/play'
import { getAblyJWT, sendStateThroughAbly } from '../../utils/ably'
import { getGameState, mutateGameState } from '../../utils/gameState'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request, params } = context

  let roomKey: string

  if (Array.isArray(params.roomKey)) {
    roomKey = params.roomKey[0]
  } else {
    roomKey = params.roomKey
  }

  const roomId = `knucklebones:${roomKey}`

  const play = await request.json<Play>()

  const gameState = await getGameState(roomId, env)
  const mutatedGameState = mutateGameState(play, gameState)

  await env.GAME_STATE_STORE.put(roomId, JSON.stringify(mutatedGameState), {
    expirationTtl: 86400
  })

  const ablyJWT = await getAblyJWT(env)
  await sendStateThroughAbly(mutatedGameState, ablyJWT, roomId)

  return jsonResponse(mutatedGameState, { status: 200 })
}
