import * as React from 'react'
import { Button } from './Button'
import { PlayIcon } from '@heroicons/react/24/outline'
import { ShortcutModal } from './ShortcutModal'
import { type GameContext } from '../hooks/useGame'
import { useIsOnDesktop } from '../hooks/detectDevice'

interface GetWinMessageArgs extends Pick<GameContext, 'outcome' | 'winner'> {}

function getWinMessage({ outcome, winner }: GetWinMessageArgs) {
  if (outcome === 'game-ended') {
    if (winner !== undefined) {
      return `${winner.inGameName} won with ${winner.score} points!`
    }
    return 'This is a tie! Nobody wins!'
  }
  return ''
}

interface OutcomeProps
  extends GetWinMessageArgs,
    Pick<
      GameContext,
      'rematchVote' | 'playerOne' | 'playerTwo' | 'playerSide'
    > {
  onRematch(): void
}

export function GameOutcome({
  outcome,
  winner,
  playerSide,
  playerOne,
  playerTwo,
  rematchVote,
  onRematch
}: OutcomeProps) {
  const isSpectator = playerSide === 'spectator'
  const hasVotedRematch = rematchVote === playerOne.id
  const isOnDesktop = useIsOnDesktop()

  if (outcome === 'ongoing') {
    // On peut mettre un VS semi-transparent dans le fond de la partie
    // pour rappeler cet élément sans pour autant que ça prenne de l'espace dans
    // le layout.
    return <p className='hidden md:block'>VS</p>
  }

  const content = (
    <div className='grid justify-items-center gap-2 font-semibold'>
      <p>{getWinMessage({ outcome, winner })}</p>
      {!isSpectator && (
        <Button onClick={onRematch} disabled={hasVotedRematch}>
          Rematch
        </Button>
      )}

      {!isSpectator &&
        (hasVotedRematch ? (
          <p>Waiting for {playerTwo.inGameName}...</p>
        ) : (
          rematchVote !== undefined && ( // It means the other player has voted for rematch
            <p>{playerTwo.inGameName} wants to rematch!</p>
          )
        ))}
    </div>
  )

  if (isOnDesktop) {
    return content
  }

  return (
    <ShortcutModal icon={<PlayIcon />} label='Continue' isInitiallyOpen>
      {content}
    </ShortcutModal>
  )
}
