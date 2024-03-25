import { type IGameState, type ILobby, Lobby } from '@knucklebones/common'
import { createDurable } from 'itty-durable'
import { type CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { type IttyDurableObjectNamespace } from '../types/itty'

export class GameStateDurableObject extends createDurable({
  autoPersist: true
}) {
  lobby: ILobby
  gameState?: IGameState

  constructor(
    state: DurableObjectState,
    cloudflareEnvironment: CloudflareEnvironment
  ) {
    super(state, cloudflareEnvironment)
    this.lobby = new Lobby().toJson()
  }

  getGameState(): IGameState {
    return this.gameState!
  }

  getLobby(): ILobby {
    return this.lobby
  }

  saveGameState(gameState: IGameState) {
    this.gameState = gameState
  }

  saveLobby(lobby: ILobby) {
    this.lobby = lobby
  }

  isGameStateInitialized(): boolean {
    return this.gameState !== undefined
  }
}

export interface GameStateDurableObjectProps {
  GAME_STATE_DURABLE_OBJECT: IttyDurableObjectNamespace<GameStateDurableObject>
}
