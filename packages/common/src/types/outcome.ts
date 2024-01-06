export type Outcome = 'ongoing' | 'round-ended' | 'game-ended'

export interface PlayerOutcome {
  id: string
  score: number
}

export interface OutcomeHistoryEntry {
  playerOne: PlayerOutcome
  playerTwo: PlayerOutcome
}

export type OutcomeHistory = OutcomeHistoryEntry[]
