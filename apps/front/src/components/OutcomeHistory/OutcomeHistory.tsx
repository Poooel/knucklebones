import { useTranslation } from 'react-i18next'
import { RectangleStackIcon } from '@heroicons/react/24/outline'
import { Modal } from '../Modal'
import { ShortcutModal } from '../ShortcutModal'
import { Text } from '../Text'
import { HistoryDetail } from './HistoryDetail'
import { ScoreDisplay } from './ScoreDisplay'
import { getWinHistory } from '@knucklebones/common'
import { useGame } from '../GameContext'

export function OutcomeHistory() {
  const { boType, outcomeHistory, playerSide, playerOne, playerTwo } = useGame()
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
