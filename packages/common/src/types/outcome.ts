// Ça serait beaucoup plus simple d'avoir `gameState.winner` depuis le back,
// qui contient l'ID du gagnant. Ensuite on pourrait faire directement:
// `winner === playerOne.id ? playerOne : playerTwo`
export type Outcome = 'player-one-win' | 'player-two-win' | 'tie' | 'ongoing'

// Pareil ici, si on peut mapper un id à un score, on récupère l'id du gagnant,
// et on retrouve le joueur.
export interface OutcomeHistoryEntry {
  playerOneScore: number
  playerTwoScore: number
}
export type OutcomeHistory = OutcomeHistoryEntry[]
