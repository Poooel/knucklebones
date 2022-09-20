import { Types } from 'ably'
import { Player } from './players'

export interface Play {
  column: number
  value: number
}

export interface Dice {
  dice: number
}

export interface InitialDice {
  initialDice: number
  target: Player
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

interface InitialDiceMessage extends Types.Message {
  data: InitialDice
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

export function isItInitialDice(
  message: Types.Message
): message is InitialDiceMessage {
  const { initialDice, target } = message.data
  return Number.isInteger(initialDice) && target in Player
}

/**
 * Type guard for messages to assert that they are turn selection.
 */
export function isItTurnSelection(
  message: Types.Message
): message is TurnSelectionMessage {
  const { shouldSenderStart } = message.data
  return typeof shouldSenderStart === 'boolean'
}
