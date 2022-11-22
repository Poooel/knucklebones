import { IPlayer } from '../interfaces'
import { Difficulty } from '../types'
import { getColumnScore, sum } from '../utils'

export class Player {
  id: string
  displayName?: string
  difficulty?: Difficulty
  dice?: number
  columns: number[][]

  constructor(
    id: string,
    displayName?: string,
    difficulty?: Difficulty,
    dice?: number,
    columns?: number[][]
  ) {
    this.id = id
    this.displayName = displayName
    this.difficulty = difficulty
    this.dice = dice
    this.columns = columns ?? [[], [], []]
  }

  addDice(dice: number, column: number) {
    if (column > 2) {
      throw new Error('Unknown column. Value must be between 0 and 2.')
    }

    if (this.columns[column].length >= 3) {
      throw new Error("Can't add dice in column because it's already full.")
    } else {
      this.columns[column].push(dice)
    }
  }

  removeDice(dice: number, column: number) {
    if (column > 2) {
      throw new Error('Unknown column. Value must be between 0 and 2.')
    }

    this.columns[column] = this.columns[column].filter(
      (existingDice) => existingDice !== dice
    )
  }

  areColumnsFilled(): boolean {
    // 3 columns x 3 rows = 9 dice
    return this.columns.flat().length === 9
  }

  getName() {
    return this.displayName ?? this.id
  }

  equals(otherPlayer?: Player) {
    if (otherPlayer === undefined) {
      return false
    } else {
      return otherPlayer.id === this.id
    }
  }

  getScore(): number {
    return sum(this.getScorePerColumn())
  }

  private getScorePerColumn(): number[] {
    return this.columns.map((column) => {
      return getColumnScore(column)
    })
  }

  isAi(): boolean {
    return this.difficulty !== undefined
  }

  static fromJson(player: IPlayer) {
    return new Player(
      player.id,
      player.displayName,
      player.difficulty,
      player.dice,
      player.columns
    )
  }

  toJson(): IPlayer {
    return {
      id: this.id,
      displayName: this.displayName,
      difficulty: this.difficulty,
      dice: this.dice,
      columns: this.columns,
      score: this.getScore(),
      scorePerColumn: this.getScorePerColumn()
    }
  }
}
