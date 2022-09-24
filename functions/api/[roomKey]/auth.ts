import { jsonResponse } from '../../utils/jsonResponse'
import { randomName } from '../../utils/randomName'
import Ably from 'ably/build/ably-webworker.min'
import { Env } from '../../types/env'
import { getRoomId } from '../../utils/params'
import {
  addLog,
  getGameState,
  initialPlayerState,
  saveAndPropagateState
} from '../../utils/gameState'
import { getRandomValue } from '../../utils/random'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, request, params } = context

  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get('clientId') ?? randomName()

  await initializePlayers(env, params, clientId)

  if (env.ABLY_CLIENT_SIDE_API_KEY === undefined) {
    throw new Error(
      '`ABLY_CLIENT_SIDE_API_KEY` is not defined. Make sure it is available via the `.dev.vars` file locally, or it is defined in the CloudFlare environment variables.'
    )
  }
  const client = new Ably.Rest.Promise(env.ABLY_CLIENT_SIDE_API_KEY)

  const tokenRequestData = await client.auth.createTokenRequest({
    clientId
  })

  return jsonResponse(tokenRequestData, { status: 200 })
}

async function initializePlayers(
  env: Env,
  params: Params<any>,
  clientId: string
) {
  const roomId = getRoomId(params)
  const gameState = await getGameState(roomId, env)

  if (gameState.playerOne === undefined) {
    gameState.playerOne = initialPlayerState(clientId)
    addLog(gameState, `${clientId} has connected to the game`)
    await saveAndPropagateState(env, roomId, gameState)
  } else if (gameState.playerTwo === undefined) {
    gameState.playerTwo = initialPlayerState(clientId)
    addLog(gameState, `${clientId} has connected to the game`)
    await saveAndPropagateState(env, roomId, gameState)
  } else {
    gameState.nextPlayer =
      getRandomValue() > 0.5 ? gameState.playerOne.id : gameState.playerTwo.id
    addLog(gameState, `${gameState.nextPlayer} is going to play first`)
  }
}
