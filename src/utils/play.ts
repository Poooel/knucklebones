import { Types } from 'ably'

export interface Play {
  column: number
  value: number
}

interface PlayMessage extends Types.Message {
  data: Play
}

/**
 * Type guard for messages to assert that they are plays.
 */
export function isItPlay(message: Types.Message): message is PlayMessage {
  const { column, value } = message.data
  return Number.isInteger(column) && Number.isInteger(value)
}
