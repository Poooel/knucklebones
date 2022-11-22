import { Outcome } from '../types'
import { ILog } from './ILog'
import { IPlayer } from './IPlayer'

export interface IGameState {
  playerOne: IPlayer
  playerTwo: IPlayer
  logs: ILog[]
  outcome: Outcome
  nextPlayer: IPlayer
  rematchVote?: string
}
