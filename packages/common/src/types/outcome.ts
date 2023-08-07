export type Outcome = 'player-one-win' | 'player-two-win' | 'tie' | 'ongoing'

// Perhaps instead of `playerXScore`, we could have like `[Player, Player]`
// and use ids to determine the current player
export interface OutcomeHistoryEntry {
  playerOneScore: number
  playerTwoScore: number
}
export type OutcomeHistory = OutcomeHistoryEntry[]
