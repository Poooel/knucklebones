import { type Outcome, type OutcomeHistory } from '../types'
import { type ILog } from './ILog'
import { type IPlayer } from './IPlayer'

export interface IGameState {
  playerOne: IPlayer
  playerTwo: IPlayer
  spectators: string[]
  logs: ILog[]
  nextPlayer: IPlayer
  winnerId?: string
  outcome: Outcome
  outcomeHistory: OutcomeHistory
  rematchVote?: string
}
