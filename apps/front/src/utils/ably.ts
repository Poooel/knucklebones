import { Types } from 'ably'
import { configureAbly } from '@ably-labs/react-hooks'

export function connectToAbly(): Types.RealtimePromise {
  const playerId = localStorage.getItem('playerId')
  return configureAbly({
    authUrl: `${import.meta.env.VITE_WORKER_URL}/auth${
      playerId !== null ? `/${playerId}` : ''
    }`
  })
}
