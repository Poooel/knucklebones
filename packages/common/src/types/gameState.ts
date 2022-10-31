import { Difficulty } from './difficulty'
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
  playingAgainstAi: boolean
  aiDifficulty?: Difficulty
}

export const emptyGameState: GameState = {
  logs: [],
  gameOutcome: 'not-started',
  rematchVote: [],
  playingAgainstAi: false
}
