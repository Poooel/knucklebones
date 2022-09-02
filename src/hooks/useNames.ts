import * as React from 'react'
import { usePresence } from '@ably-labs/react-hooks'
import { useAltChannel } from './useAltChannel'

/**
 * Inspects who is logged in to the current game, and determines the name of
 * the current user (and stores it) and the opponent.
 */
export function useNames(roomId: string) {
  const [myName, setMyName] = React.useState<string | null>(null)
  const [opponentName, setOpponentName] = React.useState<string | null>(null)
  // Can introduce later a list of spectators to be displayed

  const [, ably, { isItMe }] = useAltChannel(roomId)
  const [presenceData] = usePresence(roomId)

  React.useEffect(() => {
    setMyName(null)
    setOpponentName(null)

    presenceData.forEach(({ clientId }) => {
      if (isItMe(clientId)) {
        setMyName(clientId)
      } else {
        setOpponentName(clientId)
      }
    })
  }, [presenceData])

  React.useEffect(() => {
    if (ably.auth.clientId !== undefined) {
      localStorage.setItem('clientId', ably.auth.clientId)
    }
  }, [ably.auth.clientId])

  return {
    myName,
    opponentName
  }
}
