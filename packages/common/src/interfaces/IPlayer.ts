import { type Difficulty } from '../types'

export interface IPlayer {
  id: string
  displayName?: string
  difficulty?: Difficulty
  dice?: number
  columns: number[][]
  score: number
  scorePerColumn: number[]
}
