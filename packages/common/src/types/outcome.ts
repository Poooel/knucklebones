// Plus tard on pourra ajouter `round-ended` pour les BO
export type Outcome = 'ongoing' | 'game-ended'

export interface PlayerOutcome {
  id: string
  score: number
}

export interface OutcomeHistoryEntry {
  playerOne: PlayerOutcome
  playerTwo: PlayerOutcome
}

export type OutcomeHistory = OutcomeHistoryEntry[]
