import * as React from 'react'
import { isItPlay, isItTurnSelection, TurnSelection } from '../utils/messages'
import { Player } from '../utils/players'
import { getRandomDice } from '../utils/random'
import { useRoom } from './useRoom'

/**
 * Simple hook to keep turns synchronized locally, and detects whether that's
 * the player's turn.
 */
export function useTurn(
  sendInitialDice: (dice: number, target: Player) => void
) {
  const [turn, setTurn] = React.useState<Player>(Player.Spectator)

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

  // Read the last (and only) message from the sub room to know if a player
  // already sent a message to select who should play first.
  const [channel, ably] = useRoom({
    rewind: 1,
    subRoomId: 'turn',
    onMessageReceived(message) {
      if (isItTurnSelection(message)) {
        if (isItPlayerOne(message.clientId)) {
          setTurn(
            message.data.shouldSenderStart ? Player.PlayerOne : Player.PlayerTwo
          )
        } else {
          setTurn(
            message.data.shouldSenderStart ? Player.PlayerTwo : Player.PlayerOne
          )
        }
      }
    }
  })

  // If no message was previously sent to select turn, the current player sends
  // one.
  React.useEffect(() => {
    if (ably.auth.clientId !== undefined) {
      channel.history((err, result) => {
        if (err != null) console.error(err)
        if (result?.items.length === 0) {
          const shouldSenderStart = Math.random() > 0.5
          const message: TurnSelection = {
            shouldSenderStart
          }
          channel.publish('select', message)
          sendInitialDice(
            getRandomDice(),
            shouldSenderStart ? Player.PlayerOne : Player.PlayerTwo
          )
        }
      })
    }
  }, [ably.auth.clientId])

  // We should export a loading state, since this can have some delay, causing
  // a player to add a dice even when it wasn't their turn
  // Issue: If we don't expose the `setTurn` to be called when a dice is placed
  // there will be a delay before disabling that allows a player to play twice
  // We could solve this by either exposing the function, or managing the status
  return turn
}
