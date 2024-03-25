import { useTranslation } from 'react-i18next'
import { PlayIcon } from '@heroicons/react/24/outline'
import { t } from 'i18next'
import { useIsOnDesktop } from '../hooks/detectDevice'
import { type GameContext } from '../hooks/useGame'
import { Button } from './Button'
import { ShortcutModal } from './ShortcutModal'

interface GetWinMessageArgs extends Pick<GameContext, 'outcome' | 'winner'> {}

function getWinMessage({ outcome, winner }: GetWinMessageArgs) {
  if (outcome !== 'ongoing') {
    if (winner !== undefined) {
      const gameScope = outcome === 'round-ended' ? 'round' : 'game'
      const playerWin = winner.isPlayerOne ? 'you-win' : 'opponent-win'
      return t(`game.${gameScope}.${playerWin}` as const, {
        player: winner.inGameName,
        points: winner.score
      })
    }
    return t(outcome === 'round-ended' ? 'game.round.tie' : 'game.game.tie')
  }
  return ''
}

interface VoteButtonProps extends Pick<GameContext, 'boType' | 'outcome'> {
  hasVoted: boolean
  onRematch(): void
  onContinue(): void
  onContinueIndefinitely(): void
}

function VoteButtons({
  boType,
  hasVoted,
  outcome,
  onContinue,
  onContinueIndefinitely,
  onRematch
}: VoteButtonProps) {
  const { t } = useTranslation()
  if (boType !== 'indefinite') {
    if (outcome === 'round-ended') {
      return (
        <Button onClick={onContinue} disabled={hasVoted}>
          {t('game.continue')}
        </Button>
      )
    }
    if (outcome === 'game-ended') {
      return (
        <div className='flex flex-col items-center gap-2 md:flex-row'>
          <Button onClick={onRematch} disabled={hasVoted}>
            {t('game.rematch')}
          </Button>
          <Button onClick={onContinueIndefinitely} disabled={hasVoted}>
            {t('game.go-free-play')}
          </Button>
        </div>
      )
    }
  }
  return (
    <Button onClick={onRematch} disabled={hasVoted}>
      {t('game.rematch')}
    </Button>
  )
}

interface OutcomeProps
  extends GetWinMessageArgs,
    Omit<VoteButtonProps, 'hasVoted'>,
    Pick<
      GameContext,
      'rematchVote' | 'playerOne' | 'playerTwo' | 'playerSide'
    > {}

export function GameOutcome({
  outcome,
  winner,
  playerSide,
  playerOne,
  playerTwo,
  rematchVote,
  boType,
  onContinue,
  onContinueIndefinitely,
  onRematch
}: OutcomeProps) {
  const isSpectator = playerSide === 'spectator'
  const hasVoted = rematchVote === playerOne.id
  const isOnDesktop = useIsOnDesktop()
  const { t } = useTranslation()

  if (outcome === 'ongoing') {
    // On peut mettre un VS semi-transparent dans le fond de la partie
    // pour rappeler cet élément sans pour autant que ça prenne de l'espace dans
    // le layout.
    return <p className='hidden lg:block'>VS</p>
  }

  const content = (
    <div className='grid justify-items-center gap-2 font-semibold'>
      <p>{getWinMessage({ outcome, winner })}</p>
      {!isSpectator && (
        <VoteButtons
          boType={boType}
          hasVoted={hasVoted}
          outcome={outcome}
          onContinue={onContinue}
          onContinueIndefinitely={onContinueIndefinitely}
          onRematch={onRematch}
        />
      )}

      {!isSpectator &&
        (hasVoted ? (
          <p>{t('game.waiting-rematch', { player: playerTwo.inGameName })}</p>
        ) : (
          rematchVote !== undefined && ( // It means the other player has voted for rematch
            <p>
              {t('game.opponent-rematch', { player: playerTwo.inGameName })}
            </p>
          )
        ))}
    </div>
  )

  if (isOnDesktop) {
    return content
  }

  return (
    <ShortcutModal
      icon={<PlayIcon />}
      label={t('game.continue')}
      isInitiallyOpen
    >
      {content}
    </ShortcutModal>
  )
}
