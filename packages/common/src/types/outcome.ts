export type Outcome = 'player-one-win' | 'player-two-win' | 'tie' | 'ongoing'

export type OutcomeHistory = Array<Exclude<Outcome, 'ongoing'>>
