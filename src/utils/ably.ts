import { Types } from 'ably'
import { configureAbly } from '@ably-labs/react-hooks'

export function connectToAbly(roomKey: string): Types.RealtimePromise {
  const clientId = localStorage.getItem('clientId')

  return configureAbly({
    authUrl: `/api/${roomKey}/auth${
      clientId !== null ? `?clientId=${clientId}` : ''
    }`
  })
}
