import { ITransientGameState } from '../interfaces'
import { GameState } from './GameState'
import { Log } from './Log'
import { Player } from './Player'

export class TransientGameState {
  playerOne?: Player
  playerTwo?: Player
  logs: Log[]

  constructor(playerOne?: Player, playerTwo?: Player, logs?: Log[]) {
    this.playerOne = playerOne
    this.playerTwo = playerTwo
    this.logs = logs ?? []
  }

  addPlayer(player: Player) {
    if (player.equals(this.playerOne) || player.equals(this.playerTwo)) {
      return
    }

    if (this.playerOne === undefined) {
      this.playerOne = player
      this.addToLogs(`${player.getName()} joined`)
    } else {
      this.playerTwo = player
      this.addToLogs(`${player.getName()} joined`)
    }
  }

  isReady(): boolean {
    return this.playerOne !== undefined && this.playerTwo !== undefined
  }

  toGameState(): GameState {
    return new GameState(this.playerOne!, this.playerTwo!, this.logs)
  }

  addToLogs(logLine: string) {
    this.logs.push(new Log(logLine))
  }

  static fromJson(iTransientGameState: ITransientGameState) {
    return new TransientGameState(
      iTransientGameState.playerOne === undefined
        ? undefined
        : Player.fromJson(iTransientGameState.playerOne),
      iTransientGameState.playerTwo === undefined
        ? undefined
        : Player.fromJson(iTransientGameState.playerTwo)
    )
  }

  toJson(): ITransientGameState {
    return {
      playerOne: this.playerOne,
      playerTwo: this.playerTwo
    }
  }
}
