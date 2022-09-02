import * as React from 'react'
import {
  useChannel,
  AblyMessageCallback,
  ChannelAndClient
} from '@ably-labs/react-hooks'

/**
 * Thin wrapper around Ably's `useChannel` for improved usage:
 * - Explicit parameter for rewinding channel's messages
 * - `isItMe` utility to detect messages published by the current user
 * - Optional callback
 */
export function useAltChannel(
  roomId: string,
  options: { rewind?: number } = {},
  callback: AblyMessageCallback = () => {}
): [
  ChannelAndClient[0],
  ChannelAndClient[1],
  { isItMe(clientId: string): boolean }
] {
  const rewindString =
    options.rewind !== undefined ? `[?rewind=${options.rewind}]` : ''
  const [channel, ably] = useChannel(rewindString + roomId, callback)

  const isItMe = React.useCallback(
    (clientId: string) => {
      return clientId === ably.auth.clientId
    },
    [ably.auth.clientId]
  )

  return [channel, ably, { isItMe }]
}
