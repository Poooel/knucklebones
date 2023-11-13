import { type IPlayer, isEmptyOrBlank } from '@knucklebones/common'
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals
} from 'unique-names-generator'

// At most, we get a 21 character long name
const MAX_WORD_LENGTH = 7
export const MAX_NAME_LENGTH = MAX_WORD_LENGTH * 3

const shortAdjectives = adjectives.filter((a) => a.length <= MAX_WORD_LENGTH)
const shortColors = colors.filter((c) => c.length <= MAX_WORD_LENGTH)
const shortAnimals = animals.filter((a) => a.length <= MAX_WORD_LENGTH)

export const randomName = () => {
  return uniqueNamesGenerator({
    dictionaries: [shortAdjectives, shortColors, shortAnimals],
    length: 3,
    style: 'capital',
    separator: ''
  })
}

export interface PlayerNameProps extends Pick<IPlayer, 'displayName' | 'id'> {}

export function getName({ displayName, id }: PlayerNameProps) {
  if (displayName === undefined || isEmptyOrBlank(displayName)) {
    return id
  } else {
    return decodeURIComponent(displayName).substring(0, MAX_NAME_LENGTH)
  }
}
