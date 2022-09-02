import { configureAbly } from '@ably-labs/react-hooks'

export function connectToGame() {
  const clientId = localStorage.getItem('clientId')
  // Will be read from URL, or auto-generated
  const roomId = 'knucklebones:test:alexis10'

  configureAbly({
    authUrl: `/api/auth${clientId !== null ? `?clientId=${clientId}` : ''}`
  })

  return roomId
}
