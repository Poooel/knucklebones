import * as React from 'react'
import { isItPlay, Play } from '../utils/messages'
import { useRoom } from './useRoom'

/**
 * Simple hook to keep the game synchronized, by allowing to publish one's plays,
 * and receive the oppononent's plays.
 * Can later be used to synchronize dice
 */
export function useGame({
  onPlayerTwoPlay
}: {
  onPlayerTwoPlay(play: Play): void
}) {
  const [channel, , { isItPlayerOne }] = useRoom({
    onMessageReceived(message) {
      if (!isItPlayerOne(message.clientId) && isItPlay(message)) {
        onPlayerTwoPlay(message.data)
      }
    }
  })

  function sendPlay(play: Play) {
    channel.publish('play', play)
  }

  return { sendPlay }
}

/**
 * Allows to read the previous plays from the current game and resume it.
 */
export function useResumeGame({
  onPlayerOnePlay,
  onPlayerTwoPlay
}: {
  onPlayerOnePlay(play: Play): void
  onPlayerTwoPlay(play: Play): void
}) {
  const [channel, ably, { isItPlayerOne }] = useRoom()

  React.useEffect(() => {
    if (ably.auth.clientId !== undefined) {
      channel.history((err, result) => {
        if (err != null) {
          console.error(err)
        }

        if (result !== undefined) {
          // Messages in history are returned from newest to oldest. We need to
          // reverse the order to follow the same plays order as the game
          // (needed for the dice removal logic).
          result.items.reverse().forEach((item) => {
            if (isItPlay(item)) {
              const { clientId, data } = item
              if (isItPlayerOne(clientId)) {
                onPlayerOnePlay(data)
              } else {
                onPlayerTwoPlay(data)
              }
            }
          })
        }
      })
    }
  }, [ably.auth.clientId])
}
