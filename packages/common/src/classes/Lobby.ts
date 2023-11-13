import { type ILobby } from '../interfaces'
import { GameState } from './GameState'
import { Player } from './Player'

export class Lobby {
  players: Player[]

  constructor(players?: Player[]) {
    this.players = players ?? []
  }

  addPlayer(player: Player): boolean {
    if (this.players.length >= 2) {
      return false
    }

    if (
      this.players.find((presentPlayer) => presentPlayer.equals(player)) !==
      undefined
    ) {
      return false
    }

    this.players.push(player)
    return true
  }

  isReady(): boolean {
    return this.players.length === 2
  }

  toGameState(): GameState {
    const gameState = new GameState({
      playerOne: this.players[0],
      playerTwo: this.players[1]
    })
    gameState.initialize()
    return gameState
  }

  static fromJson(iLobby: ILobby): Lobby {
    return new Lobby(iLobby.players.map((iPlayer) => Player.fromJson(iPlayer)))
  }

  toJson(): ILobby {
    return {
      players: this.players.map((player) => player.toJson())
    }
  }
}
