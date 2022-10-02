import {
  ThrowableRouter,
  missing,
  withParams,
  withContent,
  json
} from 'itty-router-extras'
import { withDurables } from 'itty-durable'
import { initializePlayers, mutateGameState } from './utils/gameState'
import { sendStateThroughAbly } from './ably'
import Ably from 'ably/build/ably-webworker.min'
import { randomName } from './randomName'
import { Env } from './env'
import { GameStateDurableProps } from './gameStateDurable'
import { Play } from './types'

export { GameStateDurable } from './gameStateDurable'

interface RequestWithProps extends Request, GameStateDurableProps {
  clientId?: string
  roomId?: string
  content?: Play
}

const router = ThrowableRouter()

router
  .all('*', withDurables())

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
    '/:roomId/:clientId/init',
    withParams,
    async (req: RequestWithProps, env: Env) => {
      const gameStateDurable = req.GAME_STATE_DURABLE.get(req.roomId!)
      const gameState = await gameStateDurable.getState()
      const initializedGameState = initializePlayers(gameState, req.clientId!)
      await gameStateDurable.save(initializedGameState)
      await sendStateThroughAbly(initializedGameState, env, req.roomId!)
      return json(initializedGameState)
    }
  )

  .post(
    '/:roomId/play',
    withParams,
    withContent,
    async (req: RequestWithProps, env: Env) => {
      const gameStateDurable = req.GAME_STATE_DURABLE.get(req.roomId!)
      const gameState = await gameStateDurable.getState()
      const mutatedGameState = mutateGameState(req.content!, gameState)
      await gameStateDurable.save(mutatedGameState)
      await sendStateThroughAbly(mutatedGameState, env, req.roomId!)
      return json(mutatedGameState)
    }
  )

  .all('*', () => missing('Are you sure about that?'))

export default {
  fetch: router.handle
}
