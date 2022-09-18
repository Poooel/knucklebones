import { Types } from 'ably'

export interface Play {
  column: number
  value: number
}

export interface Dice {
  dice: number
}

export interface TurnSelection {
  shouldSenderStart: boolean
}

interface PlayMessage extends Types.Message {
  data: Play
}

interface DiceMessage extends Types.Message {
  data: Dice
}

interface TurnSelectionMessage extends Types.Message {
  data: TurnSelection
}

/**
 * Type guard for messages to assert that they are plays.
 */
export function isItPlay(message: Types.Message): message is PlayMessage {
  const { column, value } = message.data
  return Number.isInteger(column) && Number.isInteger(value)
}

/**
 * Type guard for messages to assert that they are dice.
 */
export function isItDice(message: Types.Message): message is DiceMessage {
  const { dice } = message.data
  return Number.isInteger(dice)
}

/**
 * Type guard for messages to assert that they are turn selection.
 */
export function isItTurnSelection(
  message: Types.Message
): message is TurnSelectionMessage {
  const { shouldSenderStart } = message.data
  return Boolean(shouldSenderStart)
}
