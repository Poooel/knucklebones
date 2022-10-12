import { Types } from 'ably'
import { configureAbly } from '@ably-labs/react-hooks'

export function connectToAbly(): Types.RealtimePromise {
  return configureAbly({
    authUrl: `${import.meta.env.VITE_WORKER_URL}/auth`
  })
}
