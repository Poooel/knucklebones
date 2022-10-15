import { createDurable } from 'itty-durable'
import { GameState, emptyGameState } from '@knucklebones/common'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { IttyDurableObjectNamespace } from '../types/itty'

export class GameStateStore extends createDurable({ autoPersist: true }) {
  gameState: GameState

  constructor(
    state: DurableObjectState,
    cloudflareEnvironment: CloudflareEnvironment
  ) {
    super(state, cloudflareEnvironment)
    this.gameState = emptyGameState
  }

  save(gameState: GameState) {
    this.gameState = gameState
  }

  getState() {
    return this.gameState
  }
}

export interface GameStateStoreProps {
  GAME_STATE_STORE: IttyDurableObjectNamespace<GameStateStore>
}
