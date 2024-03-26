import { useTranslation } from 'react-i18next'
import { RectangleStackIcon } from '@heroicons/react/24/outline'
import { type GameContext } from '../../hooks/useGame'
import { Modal } from '../Modal'
import { Text } from '../Text'
import { ShortcutModal } from '../ShortcutModal'
import { getLeadMessage } from './leadMessage.utils'
import { HistoryDetail } from './HistoryDetail'
import { ScoreDisplay } from './ScoreDisplay'
import { getWinHistory } from '@knucklebones/common'

interface OutcomeHistoryProps
  extends Pick<
    GameContext,
    'outcomeHistory' | 'playerOne' | 'playerTwo' | 'playerSide' | 'boType'
  > {}

export function OutcomeHistory({
  boType,
  outcomeHistory,
  playerSide,
  playerOne,
  playerTwo
}: OutcomeHistoryProps) {
  const { t } = useTranslation()
  const detailedHistory = getWinHistory(outcomeHistory)
  const lastGameOutcome = detailedHistory.at(-1) ?? {
    playerOne: { id: playerOne.id, score: 0, wins: 0 },
    playerTwo: { id: playerOne.id, score: 0, wins: 0 }
  }

  return (
    <ShortcutModal
      icon={<RectangleStackIcon />}
      label={
        <ScoreDisplay
          {...lastGameOutcome}
          boType={boType}
          playerSide={playerSide}
        />
      }
    >
      <Modal.Title>{t('menu.history.title')}</Modal.Title>
      <div className='grid grid-cols-1 gap-2'>
        <Text className='text-center'>
          {getLeadMessage({
            gameOutcome: lastGameOutcome,
            boType,
            playerOne,
            playerTwo
          })}
        </Text>
        <HistoryDetail
          detailedHistory={detailedHistory}
          playerOne={playerOne}
          playerTwo={playerTwo}
        />
      </div>
    </ShortcutModal>
  )
}
