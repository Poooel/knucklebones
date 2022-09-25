import * as React from 'react'
import { useRoom } from '../hooks/useRoom'
import { connectToAbly } from '../utils/ably'

export function useAbly() {
  const { roomKey } = useRoom()
  const [isConnected, setIsConnected] = React.useState(false)

  // Initialize the room after being authenticated
  React.useEffect(() => {
    console.log({ roomKey })
    const client = connectToAbly(roomKey)
    client.connection.on('connected', () => {
      // Save client ID after being authenticated
      localStorage.setItem('clientId', client.auth.clientId)
      setIsConnected(true)
    })
  }, [roomKey])

  return isConnected
}
