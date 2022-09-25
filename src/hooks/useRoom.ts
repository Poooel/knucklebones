import { useParams } from 'react-router-dom'

interface Params {
  roomKey: string
}

export function useRoom() {
  // Enforcing `roomKey` to be defined, since it should only be used in a route
  // with the room key available.
  const { roomKey } = useParams<keyof Params>() as Params
  return {
    roomKey,
    roomId: `knucklebones:${roomKey}`
  }
}
