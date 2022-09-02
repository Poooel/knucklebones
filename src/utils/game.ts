import { configureAbly } from '@ably-labs/react-hooks'

export function connectToGame() {
  const clientId = localStorage.getItem('clientId')

  configureAbly({
    authUrl: `/api/auth${clientId !== null ? `?clientId=${clientId}` : ''}`
  })
}
