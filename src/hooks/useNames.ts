import * as React from 'react'
import { usePresence } from '@ably-labs/react-hooks'
import { useRoom, useRoomId } from './useRoom'

/**
 * Inspects who is logged in to the current game, and determines the name of
 * the current user (and stores it) and the opponent.
 */
export function useNames() {
  const [playerOneName, setPlayerOneName] = React.useState<string | null>(null)
  const [playerTwoName, setplayerTwoName] = React.useState<string | null>(null)
  const roomId = useRoomId()
  // Can introduce later a list of spectators to be displayed

  const [, ably, { isItPlayerOne }] = useRoom()
  const [presenceData] = usePresence(roomId)

  React.useEffect(() => {
    setPlayerOneName(null)
    setplayerTwoName(null)

    presenceData.forEach(({ clientId }) => {
      if (isItPlayerOne(clientId)) {
        setPlayerOneName(clientId)
      } else {
        setplayerTwoName(clientId)
      }
    })
  }, [presenceData])

  React.useEffect(() => {
    if (ably.auth.clientId !== undefined) {
      localStorage.setItem('clientId', ably.auth.clientId)
    }
  }, [ably.auth.clientId])

  return {
    playerOneName,
    playerTwoName
  }
}
