import { GameOutcome } from './gameOutcome'
import { Player } from './player'

export interface GameState {
  playerOne: Player
  playerTwo: Player
  logs: string[]
  gameOutcome: GameOutcome
}
