import { GameState } from '@knucklebones/common'
import { json } from 'itty-router-extras'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { PromisifyPublicFunctions, RequestWithProps } from '../types/itty'
import { GameStateStore } from '../workers'
import { sendStateThroughAbly } from './ably'
import { getRoomId } from './room'

export async function fetchResources(request: RequestWithProps) {
  const roomId = getRoomId(request.roomKey!)
  const gameStateStore = request.GAME_STATE_STORE.get(roomId)
  const gameState = await gameStateStore.getState()

  return {
    roomId,
    gameStateStore,
    gameState
  }
}

export async function saveAndPropagate(
  gameState: GameState,
  roomId: string,
  gameStateStore: PromisifyPublicFunctions<GameStateStore>,
  cloudflareEnvironment: CloudflareEnvironment
) {
  await gameStateStore.save(gameState)
  await sendStateThroughAbly(gameState, cloudflareEnvironment, roomId)
  return json(gameState)
}
