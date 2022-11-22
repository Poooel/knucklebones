export interface IPlayer {
  id: string
  dice?: number
  columns: number[][]
  score: number
  scorePerColumn: number[]
  displayName?: string
}
