import { useParams } from 'react-router-dom'
import {
  useChannel,
  AblyMessageCallback,
  ChannelAndClient
} from '@ably-labs/react-hooks'

interface Params {
  roomKey: string
}

interface Options {
  rewind?: number
  subRoomId?: string
  onMessageReceived?: AblyMessageCallback
  override?: string
}

const roomName = 'knucklebones'

export function useRoomId() {
  const { roomKey } = useParams<keyof Params>() as Params
  return `${roomName}:${roomKey}`
}

/**
 * Thin wrapper around Ably's `useChannel` for improved usage:
 * - Explicit parameter for rewinding channel's messages
 * - `isItMe` utility to detect messages published by the current user
 * - Optional callback
 */
export function useRoom({
  rewind,
  subRoomId,
  onMessageReceived = () => {},
  override
}: Options = {}): [
  ChannelAndClient[0],
  ChannelAndClient[1],
  { isItPlayerOne(messageClientId: string): boolean }
] {
  const rewindString = rewind !== undefined ? `[?rewind=${rewind}]` : ''
  const subRoomString = subRoomId !== undefined ? `:${subRoomId}` : ''

  const roomId = useRoomId()
  const [channel, ably] = useChannel(
    rewindString + roomId + subRoomString,
    onMessageReceived
  )

  if (override !== undefined) {
    useChannel(override, onMessageReceived)
  }

  function isItPlayerOne(messageClientId: string) {
    return messageClientId === ably.auth.clientId
  }

  return [channel, ably, { isItPlayerOne }]
}
