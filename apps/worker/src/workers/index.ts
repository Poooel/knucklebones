import Ably from 'ably/build/ably-webworker.min'
import {
  ThrowableRouter,
  missing,
  withParams,
  withContent,
  json,
  error
} from 'itty-router-extras'
import { withDurables } from 'itty-durable'
import { createCors } from 'itty-cors'
import {
  DisplayNameUpdate,
  emptyGameState,
  initializePlayers,
  mutateGameState,
  Play
} from '@knucklebones/common'
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
      const displayName = req.query?.displayName
      const initializedGameState = initializePlayers(
        gameState,
        req.clientId!,
        displayName
      )
      await gameStateStore.save(initializedGameState)
      await sendStateThroughAbly(initializedGameState, env, roomId)
      return json(initializedGameState)
    }
  )

  .post(
    '/:roomKey/:clientId/play',
    withParams,
    withContent,
    async (req: RequestWithProps, env: Env) => {
      const roomId = `knucklebones:${req.roomKey!}`
      const gameStateStore = req.GAME_STATE_STORE.get(roomId)
      const gameState = await gameStateStore.getState()
      const play = req.content! as Play
      const mutatedGameState = mutateGameState(play, req.clientId!, gameState)
      await gameStateStore.save(mutatedGameState)
      await sendStateThroughAbly(mutatedGameState, env, roomId)
      return json(mutatedGameState)
    }
  )

  .post(
    '/:roomKey/:clientId/rematch/',
    withParams,
    async (req: RequestWithProps, env: Env) => {
      const roomId = `knucklebones:${req.roomKey!}`
      const gameStateStore = req.GAME_STATE_STORE.get(roomId)
      let gameState = await gameStateStore.getState()

      if (
        gameState.gameOutcome === 'ongoing' ||
        gameState.gameOutcome === 'not-started'
      ) {
        return error(400, "The game is still ongoing. Can't rematch.")
      }

      if (!gameState.rematchVote.includes(req.clientId!)) {
        gameState.rematchVote.push(req.clientId!)
      }

      const { playerOne, playerTwo } = gameState

      if (
        gameState.rematchVote.includes(playerOne!.id) &&
        gameState.rematchVote.includes(playerTwo!.id)
      ) {
        gameState = emptyGameState
        initializePlayers(gameState, playerOne!.id, playerOne?.displayName)
        initializePlayers(gameState, playerTwo!.id, playerTwo?.displayName)
      }

      await gameStateStore.save(gameState)
      await sendStateThroughAbly(gameState, env, roomId)
      return json(gameState)
    }
  )

  .post(
    '/:roomKey/:clientId/displayName',
    withParams,
    withContent,
    async (req: RequestWithProps, env: Env) => {
      const roomId = `knucklebones:${req.roomKey!}`
      const gameStateStore = req.GAME_STATE_STORE.get(roomId)
      const gameState = await gameStateStore.getState()
      const displayNameUpdate = req.content! as DisplayNameUpdate

      if (gameState.playerOne?.id === req.clientId!) {
        if (displayNameUpdate.displayName === '') {
          gameState.playerOne.displayName = undefined
        } else {
          gameState.playerOne.displayName = displayNameUpdate.displayName
        }
      } else if (gameState.playerTwo?.id === req.clientId) {
        if (displayNameUpdate.displayName === '') {
          gameState.playerTwo!.displayName = undefined
        } else {
          gameState.playerTwo!.displayName = displayNameUpdate.displayName
        }
      } else {
        return error(400, 'Unexpected clientId received.')
      }

      await gameStateStore.save(gameState)
      await sendStateThroughAbly(gameState, env, roomId)
      return json(gameState)
    }
  )

  .all('*', () => missing('Are you sure about that?'))

export default {
  // @ts-expect-error
  fetch: async (...args) => await router.handle(...args).then(corsify)
}
