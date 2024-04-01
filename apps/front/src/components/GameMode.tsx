import { useTranslation } from 'react-i18next'
import { useGame } from './GameContext'
import { InfoPopover } from './Popover'
import { Text } from './Text'

export function GameMode() {
  const { gameMode } = useGame()
  const { t } = useTranslation()

  return (
    <div className='flex gap-2'>
      <Text className='font-medium'>
        {t('game-settings.game-mode.label')} :{' '}
        {t(`game-settings.game-mode.${gameMode}`)}
      </Text>
      <InfoPopover>{t(`game-settings.game-mode.info`)}</InfoPopover>
    </div>
  )
}
