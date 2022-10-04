import Ably from 'ably/build/ably-webworker.min'
import {
  ThrowableRouter,
  missing,
  withParams,
  withContent,
  json
} from 'itty-router-extras'
import { withDurables } from 'itty-durable'
import { createCors } from 'itty-cors'
import { initializePlayers, mutateGameState } from '@knucklebones/common'
import { sendStateThroughAbly } from '../utils/ably'
import { randomName } from '../utils/randomName'
import { Env } from '../types/env'
import { RequestWithProps } from '../types/itty'

export { GameStateStore } from '../durable-objects/gameStateStore'

const router = ThrowableRouter()
// @ts-expect-error
const { preflight, corsify } = createCors({})

router
  .all('*', withDurables({ parse: true }))
  .options('*', preflight)

  .get(
    '/auth/:clientId?',
    withParams,
    async (req: RequestWithProps, env: Env) => {
      const clientId = req.clientId ?? randomName()
      const client = new Ably.Rest.Promise(env.ABLY_CLIENT_SIDE_API_KEY)
      const tokenRequestData = await client.auth.createTokenRequest({
        clientId
      })
      return json(tokenRequestData)
    }
  )

  .get(
    '/:roomKey/:clientId/init',
    withParams,
    async (req: RequestWithProps, env: Env) => {
      const roomId = `knucklebones:${req.roomKey!}`
      const gameStateStore = req.GAME_STATE_STORE.get(roomId)
      const gameState = await gameStateStore.getState()
      const initializedGameState = initializePlayers(gameState, req.clientId!)
      await gameStateStore.save(initializedGameState)
      await sendStateThroughAbly(initializedGameState, env, roomId)
      return json(initializedGameState)
    }
  )

  .post(
    '/:roomKey/play',
    withParams,
    withContent,
    async (req: RequestWithProps, env: Env) => {
      const roomId = `knucklebones:${req.roomKey!}`
      const gameStateStore = req.GAME_STATE_STORE.get(roomId)
      const gameState = await gameStateStore.getState()
      const mutatedGameState = mutateGameState(req.content!, gameState)
      await gameStateStore.save(mutatedGameState)
      await sendStateThroughAbly(mutatedGameState, env, roomId)
      return json(mutatedGameState)
    }
  )

  .all('*', () => missing('Are you sure about that?'))

export default {
  // @ts-expect-error
  fetch: async (...args) => await router.handle(...args).then(corsify)
}
