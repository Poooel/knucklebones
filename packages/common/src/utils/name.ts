import { Player } from '../types'

export function getName(playerId?: string, displayName?: string) {
  if (playerId === undefined && displayName === undefined) {
    return undefined
  } else if (displayName === undefined || isEmptyOrBlank(displayName)) {
    return playerId
  } else {
    return displayName
  }
}

export function getNameFromPlayer(player?: Player) {
  return getName(player?.id, player?.displayName)
}

export function isEmptyOrBlank(string: string) {
  return string.trim() === ''
}
