import { type ILobby } from '../interfaces'
import { type BoType } from '../types'
import { GameState } from './GameState'
import { Player } from './Player'

interface LobbyConstructorArg extends Partial<Omit<ILobby, 'players'>> {
  players?: Player[]
}

export class Lobby implements ILobby {
  players: Player[]
  boType?: BoType

  constructor({ boType, players = [] }: LobbyConstructorArg = {}) {
    this.players = players
    this.boType = boType
  }

  setBoType(boType: BoType) {
    this.boType = boType
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
      playerTwo: this.players[1],
      boType: this.boType
    })
    gameState.initialize()
    return gameState
  }

  static fromJson({ players, boType }: ILobby): Lobby {
    return new Lobby({
      players: players.map((iPlayer) => Player.fromJson(iPlayer)),
      boType
    })
  }

  toJson(): ILobby {
    return {
      players: this.players.map((player) => player.toJson()),
      boType: this.boType
    }
  }
}
