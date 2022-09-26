import { Types } from 'ably'
import { configureAbly } from '@ably-labs/react-hooks'

export function connectToAbly(): Types.RealtimePromise {
  const clientId = localStorage.getItem('clientId')

  return configureAbly({
    authUrl: `/api/auth${clientId !== null ? `?clientId=${clientId}` : ''}`
  })
}
