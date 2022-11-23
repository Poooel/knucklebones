import { GameState, Lobby } from '@knucklebones/common'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { BaseRequestWithProps } from '../types/itty'

export async function getGameState(
  request: BaseRequestWithProps
): Promise<GameState> {
  const gameStateDurableObject = request.GAME_STATE_DURABLE_OBJECT.get(
    request.roomKey
  )
  const iGameState = await gameStateDurableObject.getGameState()
  return GameState.fromJson(iGameState)
}

export async function getLobby(request: BaseRequestWithProps): Promise<Lobby> {
  const gameStateDurableObject = request.GAME_STATE_DURABLE_OBJECT.get(
    request.roomKey
  )
  const iLobby = await gameStateDurableObject.getLobby()
  return Lobby.fromJson(iLobby)
}

export async function saveGameState(
  gameState: GameState,
  request: BaseRequestWithProps
) {
  const roomKey = request.roomKey
  const gameStateDurableObject = request.GAME_STATE_DURABLE_OBJECT.get(roomKey)
  const iGameState = gameState.toJson()

  await gameStateDurableObject.saveGameState(iGameState)
}

export async function saveLobby(lobby: Lobby, request: BaseRequestWithProps) {
  const roomKey = request.roomKey
  const gameStateDurableObject = request.GAME_STATE_DURABLE_OBJECT.get(roomKey)
  const iLobby = lobby.toJson()

  await gameStateDurableObject.saveLobby(iLobby)
}

export async function isGameStateInitialized(
  request: BaseRequestWithProps
): Promise<boolean> {
  const roomKey = request.roomKey
  const gameStateDurableObject = request.GAME_STATE_DURABLE_OBJECT.get(roomKey)
  return await gameStateDurableObject.isGameStateInitialized()
}

export async function broadcastGameState(
  gameState: GameState,
  request: BaseRequestWithProps,
  cloudflareEnvironment: CloudflareEnvironment
) {
  const roomKey = request.roomKey
  const id = cloudflareEnvironment.WEB_SOCKET_DURABLE_OBJECT.idFromName(roomKey)
  const webSocketStore = cloudflareEnvironment.WEB_SOCKET_DURABLE_OBJECT.get(id)
  const iGameState = gameState.toJson()

  return await webSocketStore.fetch('https://dummy-url/broadcast', {
    method: 'POST',
    body: JSON.stringify(iGameState)
  })
}
