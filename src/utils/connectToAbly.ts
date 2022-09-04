import { configureAbly } from '@ably-labs/react-hooks'

export function connectToAbly() {
  const clientId = localStorage.getItem('clientId')

  configureAbly({
    authUrl: `/api/auth${clientId !== null ? `?clientId=${clientId}` : ''}`
  })
}
