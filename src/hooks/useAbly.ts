import * as React from 'react'
import { connectToAbly } from '../utils/ably'

export function useAbly() {
  const [isConnected, setIsConnected] = React.useState(false)

  // Initialize the room after being authenticated
  React.useEffect(() => {
    // Singleton
    const client = connectToAbly()

    client.connection.on('connected', () => {
      // Save client ID after being authenticated
      localStorage.setItem('clientId', client.auth.clientId)
      setIsConnected(true)
    })
    client.connection.on('disconnected', () => {
      setIsConnected(false)
    })
  }, [])

  return isConnected
}
