import { useParams } from 'react-router-dom'

interface Params {
  roomKey: string
}

export function useRoomKey() {
  const { roomKey } = useParams<keyof Params>() as Params
  return roomKey
}
