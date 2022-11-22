import { ILobby } from '../interfaces'
import { GameState } from './GameState'
import { Player } from './Player'

export class Lobby {
  players: Player[]

  constructor(players?: Player[]) {
    this.players = players ?? []
  }

  addPlayer(player: Player): boolean {
    if (this.players.length >= 2) {
      throw new Error('Too many players in the lobby.')
    }

    if (
      this.players.find((presentPlayer) => presentPlayer.equals(player)) !==
      undefined
    ) {
      throw new Error('Same player has already joined the lobby.')
    }

    this.players.push(player)
    return true
  }

  isReady(): boolean {
    return this.players.length === 2
  }

  toGameState(): GameState {
    return new GameState(this.players[0], this.players[1])
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
