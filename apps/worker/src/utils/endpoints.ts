import { GameState } from '@knucklebones/common'
import { json } from 'itty-router-extras'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { PromisifyPublicFunctions, RequestWithProps } from '../types/itty'
import { GameStateStore } from '../workers'
import { getRoomId } from './room'

export async function fetchResources(request: RequestWithProps) {
  console.log('getting roomId')
  const roomId = getRoomId(request.roomKey!)
  console.log('getting gamestatestore')
  const gameStateStore = request.GAME_STATE_STORE.get(roomId)
  console.log('getting game state')
  const gameState = await gameStateStore.getState()

  return {
    roomId,
    gameStateStore,
    gameState
  }
}

export async function saveAndPropagate(
  gameState: GameState,
  gameStateStore: PromisifyPublicFunctions<GameStateStore>,
  roomId: string,
  cloudflareEnvironment: CloudflareEnvironment
) {
  await gameStateStore.save(gameState)
  await broadcast(gameState, roomId, cloudflareEnvironment)
  return json(gameState)
}

async function broadcast(
  gameState: GameState,
  roomId: string,
  cloudflareEnvironment: CloudflareEnvironment
) {
  const id = cloudflareEnvironment.WEB_SOCKET_STORE.idFromName(roomId)
  const webSocketStore = cloudflareEnvironment.WEB_SOCKET_STORE.get(id)

  console.log('sending to durable object')

  const response = await webSocketStore.fetch(
    'https://itty-durable/broadcast',
    {
      method: 'POST',
      body: JSON.stringify(gameState)
    }
  )

  console.log('response status', response.status)
  console.log('response status text', response.statusText)

  return response
}
