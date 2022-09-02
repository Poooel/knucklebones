import * as React from 'react'
import { isItPlay } from '../utils/play'
import { useAltChannel } from './useAltChannel'

/**
 * Simple hook to keep turns synchronized locally, and detects whether that's
 * the player's turn.
 */
export function useTurn(roomId: string) {
  const [myTurn, setMyTurn] = React.useState(true)

  // This will first get the last message published to resume the turn, then
  // will update the turn based on new messages
  const [, , { isItMe }] = useAltChannel(roomId, { rewind: 1 }, (message) => {
    if (isItPlay(message)) {
      setMyTurn(!isItMe(message.clientId))
    }
  })

  // We should export a loading state, since this can have some delay, causing
  // a player to add a dice even when it wasn't their turn
  // Issue: If we don't expose the `setMyTurn` to be called when a dice is placed
  // there will be a delay before disabling that allows a player to play twice
  // We could solve this by either exposing the function, or managing the status
  return myTurn
}
