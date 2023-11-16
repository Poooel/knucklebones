import * as React from 'react'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { capitalize } from '@knucklebones/common'
import { Modal } from './Modal'
import { type Option, ToggleGroup } from './ToggleGroup'
import { Button } from './Button'

const DIFFICULTIES = ['easy', 'medium', 'hard'] as const
const BO_TYPES = ['indefinite', 1, 3, 5] as const
type Difficulty = (typeof DIFFICULTIES)[number]
type BoType = (typeof BO_TYPES)[number]

const DIFFICULTIES_OPTIONS: Option[] = DIFFICULTIES.map((difficulty) => ({
  label: capitalize(difficulty),
  value: difficulty
}))
const BO_TYPES_OPTIONS: Option[] = BO_TYPES.map((bo) => ({
  label: typeof bo === 'number' ? `Best of ${bo}` : capitalize(bo),
  value: String(bo)
}))

export type PlayerType = 'human' | 'ai'

interface GameSettingProps<T> {
  label: string
  options: Option[]
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

interface GameSettingsProps {
  playerType?: PlayerType
  onCancel(): void
}

export function GameSettings({ playerType, onCancel }: GameSettingsProps) {
  const [difficulty, setDifficulty] = React.useState<Difficulty>('medium')
  const [boType, setBoType] = React.useState<BoType>('indefinite')

  return (
    <Modal isOpen={playerType !== undefined} onClose={onCancel}>
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
          state={{
            playerType,
            boType,
            difficulty: playerType === 'ai' ? difficulty : undefined
          }}
        >
          Start game
        </Button>
      </div>
    </Modal>
  )
}
