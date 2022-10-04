import { createDurable } from 'itty-durable'
import { GameState, emptyGameState } from '@knucklebones/common'
import { Env } from '../types/env'
import { IttyDurableObjectNamespace } from '../types/itty'

export class GameStateStore extends createDurable({ autoPersist: true }) {
  gameState: GameState

  constructor(state: DurableObjectState, env: Env) {
    super(state, env)
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
