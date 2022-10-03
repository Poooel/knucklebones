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
import { initializePlayers, mutateGameState, Play } from '@knucklebones/common'
import { sendStateThroughAbly } from './ably'
import { randomName } from './randomName'
import { Env } from './env'
import { GameStateDurableProps } from './gameStateDurable'

export { GameStateDurable } from './gameStateDurable'

interface RequestWithProps extends Request, GameStateDurableProps {
  clientId?: string
  roomKey?: string
  content?: Play
}

const router = ThrowableRouter({ base: '/api' })
// @ts-expect-error
const { preflight, corsify } = createCors({})

router
  .all('*', withDurables({ parse: true }))
  .options('*', preflight)

  .get('/', async (req: RequestWithProps) => {
    const gameStateDurable = req.GAME_STATE_DURABLE.get('test')
    return await gameStateDurable.getState()
  })

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
      const gameStateDurable = req.GAME_STATE_DURABLE.get(roomId)
      const gameState = await gameStateDurable.getState()
      const initializedGameState = initializePlayers(gameState, req.clientId!)
      await gameStateDurable.save(initializedGameState)
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
      const gameStateDurable = req.GAME_STATE_DURABLE.get(roomId)
      const gameState = await gameStateDurable.getState()
      const mutatedGameState = mutateGameState(req.content!, gameState)
      await gameStateDurable.save(mutatedGameState)
      await sendStateThroughAbly(mutatedGameState, env, roomId)
      return json(mutatedGameState)
    }
  )

  .all('*', () => missing('Are you sure about that?'))

export default {
  // @ts-expect-error
  fetch: async (...args) => await router.handle(...args).then(corsify)
}
