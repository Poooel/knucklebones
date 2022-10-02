import { createDurable } from 'itty-durable'
import { GameState } from './types/gameState'
import { emptyGameState } from './utils/gameState'
import { Env } from './env'

export class GameStateDurable extends createDurable({
  autoReturn: true,
  autoPersist: true
}) {
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

export interface GameStateDurableProps {
  GAME_STATE_DURABLE: IttyDurableObjectNamespace<GameStateDurable>
}
