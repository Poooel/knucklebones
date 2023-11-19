import * as React from 'react'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import {
  type GameSettings,
  type Difficulty,
  type PlayerType
} from '@knucklebones/common'
import { Modal, type ModalProps } from '../Modal'
import { type Option, ToggleGroup } from '../ToggleGroup'
import { Button } from '../Button'
import {
  BO_TYPES_OPTIONS,
  DIFFICULTIES_OPTIONS,
  convertToBoType,
  type StringBoType
} from './options'

interface GameSettingProps<T> {
  label: string
  options: Array<Option<T>>
  value: T
  onValueChange(value: T): void
}

function GameSetting<T>({
  label,
  options,
  value,
  onValueChange
}: GameSettingProps<T>) {
  return (
    <div className='grid grid-cols-1 gap-2'>
      <label className='text-lg md:text-xl'>{label}</label>
      {/* Accessibility? */}
      <ToggleGroup
        mandatory
        type='single'
        size='medium'
        options={options}
        value={String(value)}
        onValueChange={(value) => {
          onValueChange(value as T)
        }}
      />
    </div>
  )
}

interface GameSettingsProps extends ModalProps {
  playerType?: PlayerType
}

export function GameSettingsModal({
  playerType,
  ...modalProps
}: GameSettingsProps) {
  const [difficulty, setDifficulty] = React.useState<Difficulty>('medium')
  const [boType, setBoType] = React.useState<StringBoType>('indefinite')

  return (
    <Modal {...modalProps}>
      <Modal.Title>Game settings</Modal.Title>
      <div className='grid grid-cols-1 gap-8'>
        {playerType === 'ai' && (
          <GameSetting
            label='AI difficulty'
            value={difficulty}
            onValueChange={setDifficulty}
            options={DIFFICULTIES_OPTIONS}
          />
        )}
        <GameSetting
          label='Number of games'
          value={boType}
          onValueChange={setBoType}
          options={BO_TYPES_OPTIONS}
        />
        <Button
          as={Link}
          size='medium'
          to={`/room/${uuidv4()}`}
          // Sauvegarder les paramètres dans le local storage pour les
          // prochaines parties
          state={
            {
              playerType: playerType!,
              boType:
                boType === 'indefinite' ? undefined : convertToBoType(boType),
              difficulty: playerType === 'ai' ? difficulty : undefined
            } satisfies GameSettings
          }
        >
          Start game
        </Button>
      </div>
    </Modal>
  )
}
