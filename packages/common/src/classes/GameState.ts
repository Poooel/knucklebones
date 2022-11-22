import { IGameState } from '../interfaces'
import { Outcome, Play } from '../types'
import { coinflip, getRandomDice } from '../utils'
import { Log } from './Log'
import { Player } from './Player'

export class GameState {
  playerOne: Player
  playerTwo: Player
  logs: Log[]
  outcome!: Outcome
  nextPlayer!: Player
  rematchVote?: string
  spectators: string[]

  constructor(
    playerOne: Player,
    playerTwo: Player,
    logs?: Log[],
    outcome?: Outcome,
    nextPlayer?: Player,
    rematchVote?: string,
    spectators?: string[]
  ) {
    this.playerOne = playerOne
    this.playerTwo = playerTwo

    this.logs = logs ?? []

    if (outcome !== undefined) {
      this.outcome = outcome
    }

    if (nextPlayer !== undefined) {
      this.nextPlayer = nextPlayer
    }

    this.rematchVote = rematchVote

    this.spectators = spectators ?? []

    this.initialize()
  }

  private initialize() {
    this.outcome = 'ongoing'

    const isPlayerOneStarting = coinflip()

    if (isPlayerOneStarting) {
      this.nextPlayer = this.playerOne
      this.playerOne.dice = getRandomDice()
    } else {
      this.nextPlayer = this.playerTwo
      this.playerTwo.dice = getRandomDice()
    }

    this.addToLogs(
      `${this.nextPlayer.getName()} is going first with a ${
        this.nextPlayer.dice
      }`
    )
  }

  play(play: Play) {
    const [playerOne, playerTwo] = this.getPlayers(play.author)

    playerOne.addDice(play.dice, play.column)
    this.addToLogs(
      `${playerOne.getName()} added a ${play.dice} in the ${this.getColumnName(
        play.column
      )} column`
    )

    playerTwo.removeDice(play.dice, play.column)

    if (playerOne.areColumnsFilled()) {
      this.whoWins()
    } else {
      this.nextTurn(play.author)
    }
  }

  addSpectator(spectatorId: string) {
    if (
      this.playerOne.id !== spectatorId &&
      this.playerTwo.id !== spectatorId &&
      !this.spectators.includes(spectatorId)
    ) {
      this.spectators.push(spectatorId)
    }
  }

  private getColumnName(column: number) {
    if (column === 0) {
      return 'left'
    } else if (column === 1) {
      return 'middle'
    } else if (column === 2) {
      return 'right'
    } else {
      throw new Error('Unknown column.')
    }
  }

  private getPlayers(playAuthor: string): Player[] {
    if (playAuthor === this.playerOne.id) {
      return [this.playerOne, this.playerTwo]
    } else if (playAuthor === this.playerTwo.id) {
      return [this.playerOne, this.playerTwo]
    } else {
      throw new Error('Unexpected author for move.')
    }
  }

  private nextTurn(lastPlayer: string) {
    const [playerOne, playerTwo] = this.getPlayers(lastPlayer)

    playerOne.dice = undefined
    playerTwo.dice = getRandomDice()

    this.addToLogs(
      `${playerTwo.getName()} is playing next with a ${playerTwo.dice}`
    )
  }

  private whoWins() {
    const playerOneScore = this.playerOne.getScore()
    const playerTwoScore = this.playerTwo.getScore()

    if (playerOneScore > playerTwoScore) {
      this.addToLogs(
        `${this.playerOne.getName()} wins with ${playerOneScore} points!`
      )
      this.outcome = 'player-one-win'
    } else if (playerOneScore < playerTwoScore) {
      this.addToLogs(
        `${this.playerTwo.getName()} wins with ${playerTwoScore} points!`
      )
      this.outcome = 'player-two-win'
    } else {
      this.addToLogs(
        `It's a tie... Both players have ${playerOneScore} points!`
      )
      this.outcome = 'tie'
    }
  }

  private addToLogs(logLine: string) {
    this.logs.push(new Log(logLine))
  }

  static fromJson(gameState: IGameState) {
    return new GameState(
      Player.fromJson(gameState.playerOne),
      Player.fromJson(gameState.playerTwo),
      gameState.logs.map((iLog) => Log.fromJson(iLog)),
      gameState.outcome,
      Player.fromJson(gameState.nextPlayer),
      gameState.rematchVote
    )
  }

  toJson(): IGameState {
    return {
      playerOne: this.playerOne.toJson(),
      playerTwo: this.playerTwo.toJson(),
      logs: this.logs.map((log) => log.toJson()),
      outcome: this.outcome,
      nextPlayer: this.nextPlayer.toJson(),
      rematchVote: this.rematchVote
    }
  }
}
