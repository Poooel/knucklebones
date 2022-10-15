import { GameState } from '@knucklebones/common'
import { json } from 'itty-router-extras'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { PromisifyPublicFunctions, RequestWithProps } from '../types/itty'
import { GameStateStore } from '../workers'
import { getRoomId } from './room'

export async function fetchResources(request: RequestWithProps) {
  const roomId = getRoomId(request.roomKey!)
  const gameStateStore = request.GAME_STATE_STORE.get(roomId)
  const gameState = await gameStateStore.getState()
  const url = request.url

  return {
    roomId,
    gameStateStore,
    gameState,
    url
  }
}

export async function saveAndPropagate(
  gameState: GameState,
  gameStateStore: PromisifyPublicFunctions<GameStateStore>,
  roomId: string,
  cloudflareEnvironment: CloudflareEnvironment,
  url: string
) {
  await gameStateStore.save(gameState)
  await broadcast(gameState, roomId, cloudflareEnvironment, url)
  return json(gameState)
}

async function broadcast(
  gameState: GameState,
  roomId: string,
  cloudflareEnvironment: CloudflareEnvironment,
  url: string
) {
  const id = cloudflareEnvironment.WEB_SOCKET_STORE.idFromName(roomId)
  const webSocketStore = cloudflareEnvironment.WEB_SOCKET_STORE.get(id)

  const newUrl = new URL(url)
  newUrl.pathname = '/websocket'

  return await webSocketStore.fetch(newUrl.toString(), {
    method: 'POST',
    body: JSON.stringify(gameState)
  })
}
