export interface Player {
  id: string
  dice?: number
  columns: number[][]
  score: number
  scorePerColumn: number[]
  displayName?: string
}

export function emptyPlayerState(
  playerId: string,
  displayName?: string
): Player {
  return {
    id: playerId,
    columns: [[], [], []],
    score: 0,
    scorePerColumn: [0, 0, 0],
    displayName
  }
}
