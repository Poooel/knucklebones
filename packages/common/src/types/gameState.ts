import { GameOutcome } from './gameOutcome'
import { Log } from './log'
import { Player } from './player'

export interface GameState {
  playerOne?: Player
  playerTwo?: Player
  logs: Log[]
  gameOutcome: GameOutcome
  nextPlayer?: Player
  rematchVote: string[]
}

export const emptyGameState: GameState = {
  logs: [],
  gameOutcome: 'not-started',
  rematchVote: []
}
