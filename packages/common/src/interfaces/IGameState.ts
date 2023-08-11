import { Outcome, OutcomeHistory } from '../types'
import { ILog } from './ILog'
import { IPlayer } from './IPlayer'

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
