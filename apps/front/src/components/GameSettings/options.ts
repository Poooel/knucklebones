import { type BoType, type Difficulty } from '@knucklebones/common'
import { type Option } from '../ToggleGroup'

export const DIFFICULTIES_OPTIONS: Array<Option<Difficulty>> = [
  {
    value: 'easy',
    label: 'Easy'
  },
  {
    value: 'medium',
    label: 'Medium'
  },
  {
    value: 'hard',
    label: 'Hard'
  }
]

export type StringBoType = `${BoType}` | 'indefinite'
export const BO_TYPES_OPTIONS: Array<Option<StringBoType>> = [
  {
    value: 'indefinite',
    label: 'Indefinite'
  },
  {
    value: '1',
    label: 'Best of 1'
  },
  {
    value: '3',
    label: 'Best of 3'
  },
  {
    value: '5',
    label: 'Best of 5'
  }
]

export function convertToBoType(boType: string) {
  const parsed = Number(boType)
  // .includes ?
  if (parsed === 1 || parsed === 3 || parsed === 5) {
    return parsed satisfies BoType
  }
  throw new Error(`Unknown boType: ${boType}`)
}
