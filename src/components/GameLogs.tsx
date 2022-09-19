import * as React from 'react'
import { useRoom } from '../hooks/useRoom'
import { isItDice, isItPlay } from '../utils/messages'

export function GameLogs() {
  const [logs, setLogs] = React.useState<string[]>([])

  function addToGameLog(log: string) {
    setLogs((previous) => {
      return previous?.concat(log)
    })
  }

  useRoom({
    onMessageReceived(message) {
      if (isItPlay(message)) {
        addToGameLog('bla')
      }
    }
  })

  useRoom({
    subRoomId: 'dice',
    onMessageReceived(message) {
      if (isItDice(message)) {
        addToGameLog('bla')
      }
    }
  })

  // useRoom('turn')
  // useRoom('win')

  return <ul>{JSON.stringify(logs)}</ul>
}
