import * as React from 'react'
import { isItPlay, Play } from '../utils/play'
import { useRoom } from './useRoom'

/**
 * Simple hook to keep the game synchronized, by allowing to publish one's plays,
 * and receive the oppononent's plays.
 * Can later be used to synchronize dices
 */
export function useGame(
  roomId: string,
  { onOpponentPlay }: { onOpponentPlay(play: Play): void }
) {
  const [channel, , { isItMe }] = useRoom(roomId, {}, (message) => {
    if (!isItMe(message.clientId) && isItPlay(message)) {
      onOpponentPlay(message.data)
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
export function useResumeGame(
  roomId: string,
  {
    onMyPlay,
    onOpponentPlay
  }: {
    onMyPlay(play: Play): void
    onOpponentPlay(play: Play): void
  }
) {
  const [channel, ably, { isItMe }] = useRoom(roomId)

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
              if (isItMe(clientId)) {
                onMyPlay(data)
              } else {
                onOpponentPlay(data)
              }
            }
          })
        }
      })
    }
  }, [ably.auth.clientId])
}
