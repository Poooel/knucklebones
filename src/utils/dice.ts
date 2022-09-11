import { Types } from 'ably'

export interface Dice {
  dice: number
}

interface DiceMessage extends Types.Message {
  data: Dice
}

/**
 * Type guard for messages to assert that they are plays.
 */
export function isItDice(message: Types.Message): message is DiceMessage {
  const { dice } = message.data
  return Number.isInteger(dice)
}
