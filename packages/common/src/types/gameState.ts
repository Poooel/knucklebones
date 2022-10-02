import { GameOutcome } from './gameOutcome'
import { Log } from './log'
import { Player } from './player'

export interface GameState {
  playerOne?: Player
  playerTwo?: Player
  logs: Log[]
  gameOutcome: GameOutcome
  nextPlayer?: string
}
