import * as React from 'react'
import { Link } from 'react-router-dom'
import { IGameState } from '@knucklebones/common'
import { Button } from './Button'
import { useMedia } from 'react-use'
import { PlayIcon } from '@heroicons/react/24/outline'
import { getName } from '../utils/name'
import { ToolbarModal } from './ToolbarModal'
import { GameContext } from '../hooks/useGame'

interface GetWinMessageArgs
  extends Pick<
    GameContext,
    'outcome' | 'playerOne' | 'playerTwo' | 'playerSide'
  > {}

interface OutcomeProps
  extends GetWinMessageArgs,
    Pick<IGameState, 'rematchVote'> {
  onRematch(): void
}

function getWinMessage({
  outcome,
  playerSide,
  playerOne,
  playerTwo
}: GetWinMessageArgs) {
  if (outcome === 'ongoing') return ''
  if (outcome === 'tie') return 'This is a tie! Nobody wins!'

  const winner =
    playerSide === 'spectator' ||
    (outcome === 'player-one-win' && playerSide === 'player-one') ||
    (outcome === 'player-two-win' && playerSide === 'player-two')
      ? playerOne
      : playerTwo

  return `${winner.inGameName} won with ${winner.score} points!`
}

export function GameOutcome({
  onRematch,
  playerSide,
  outcome,
  rematchVote,
  playerOne,
  playerTwo
}: OutcomeProps) {
  const isSpectator = playerSide === 'spectator'
  const hasVotedRematch = rematchVote === playerOne.id
  const isDesktop = useMedia('(min-width: 768px)')

  if (outcome === 'ongoing') {
    return <p className='hidden md:block'>VS</p>
  }

  const playerTwoName = getName(playerTwo)

  const content = (
    <div className='grid justify-items-center gap-2 font-semibold'>
      <p>{getWinMessage({ playerOne, playerTwo, outcome, playerSide })}</p>
      {!isSpectator && (
        <div className='flex gap-4'>
          <Button as={Link} to='/'>
            Replay
          </Button>
          <Button onClick={onRematch} disabled={hasVotedRematch}>
            Rematch
          </Button>
        </div>
      )}

      {!isSpectator &&
        (hasVotedRematch ? (
          <p>Waiting for {playerTwoName}...</p>
        ) : (
          rematchVote !== undefined && ( // It means the other player has voted for rematch
            <p>{playerTwoName} wants to rematch!</p>
          )
        ))}
    </div>
  )

  if (isDesktop) {
    return content
  } else {
    return (
      // Prevents from rendering an empty div in the flex parent, which adds more gap
      <div className='hidden'>
        <ToolbarModal icon={<PlayIcon />} isInitiallyOpen>
          {content}
        </ToolbarModal>
      </div>
    )
  }
}
