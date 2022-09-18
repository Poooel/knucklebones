import * as React from 'react'
import { isItPlay } from '../utils/play'
import { Player } from '../utils/players'
import { useRoom } from './useRoom'

/**
 * Simple hook to keep turns synchronized locally, and detects whether that's
 * the player's turn.
 */
export function useTurn() {
  const [turn, setTurn] = React.useState<Player>(Player.PlayerOne)

  // This will first get the last message published to resume the turn, then
  // will update the turn based on new messages
  const [, , { isItPlayerOne }] = useRoom({
    rewind: 1,
    onMessageReceived(message) {
      if (isItPlay(message)) {
        setTurn(
          !isItPlayerOne(message.clientId) ? Player.PlayerOne : Player.PlayerTwo
        )
      }
    }
  })

  // We should export a loading state, since this can have some delay, causing
  // a player to add a dice even when it wasn't their turn
  // Issue: If we don't expose the `setTurn` to be called when a dice is placed
  // there will be a delay before disabling that allows a player to play twice
  // We could solve this by either exposing the function, or managing the status
  return turn
}
