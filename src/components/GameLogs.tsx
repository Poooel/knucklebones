import { Types } from 'ably'
import * as React from 'react'
import { useRoom } from '../hooks/useRoom'
import {
  isItDice,
  isItPlay,
  isItTurnSelection,
  isItInitialDice
} from '../utils/messages'
import { Player } from '../utils/players'

interface GameLogsProps {
  playerOneName: string | null
  playerTwoName: string | null
}

export function GameLogs({ playerOneName, playerTwoName }: GameLogsProps) {
  const [logs, setLogs] = React.useState<string[]>([])

  function addToGameLog(event: string) {
    setLogs((previous) => {
      return previous.concat(event)
    })
  }

  const formatTimestamp = (message: Types.Message) => {
    const dtFormat = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'short',
      timeStyle: 'medium',
      timeZone: 'UTC'
    })

    return dtFormat.format(new Date(message.timestamp))
  }

  const [, , { isItPlayerOne }] = useRoom()

  useRoom({
    onMessageReceived(message) {
      if (isItPlay(message)) {
        addToGameLog(
          `${formatTimestamp(message)}: ${
            message.clientId
          } placed a dice in column ${message.data.column} with a value of ${
            message.data.value
          }`
        )
      }
    }
  })

  useRoom({
    subRoomId: 'dice',
    rewind: 1,
    onMessageReceived(message) {
      if (isItDice(message)) {
        addToGameLog(
          `${formatTimestamp(message)}: The next die to be placed by ${
            isItPlayerOne(message.clientId)
              ? playerTwoName ?? 'your opponent'
              : playerOneName ?? 'you'
          } is going to have a value of ${message.data.dice}`
        )
      } else if (isItInitialDice(message)) {
        if (isItPlayerOne(message.clientId)) {
          if (message.data.target === Player.PlayerOne) {
            addToGameLog(
              `${formatTimestamp(
                message
              )}: The first die to be placed by you is going to have a value of ${
                message.data.initialDice
              }`
            )
          } else if (message.data.target === Player.PlayerTwo) {
            addToGameLog(
              `${formatTimestamp(
                message
              )}: The first die to be placed by your opponent is going to have a value of ${
                message.data.initialDice
              }`
            )
          }
        } else {
          if (message.data.target === Player.PlayerOne) {
            addToGameLog(
              `${formatTimestamp(
                message
              )}: The first die to be placed by your opponent is going to have a value of ${
                message.data.initialDice
              }`
            )
          } else if (message.data.target === Player.PlayerTwo) {
            addToGameLog(
              `${formatTimestamp(
                message
              )}: The first die to be placed by you is going to have a value of ${
                message.data.initialDice
              }`
            )
          }
        }
      }
    }
  })

  useRoom({
    rewind: 1,
    subRoomId: 'turn',
    onMessageReceived(message) {
      if (isItTurnSelection(message)) {
        let nameToUse

        if (isItPlayerOne(message.clientId)) {
          nameToUse = message.data.shouldSenderStart
            ? playerOneName ?? 'You are'
            : playerTwoName ?? 'Your opponent is'
        } else {
          nameToUse = message.data.shouldSenderStart
            ? playerTwoName ?? 'Your opponent is'
            : playerOneName ?? 'You are'
        }

        addToGameLog(
          `${formatTimestamp(message)}: ${nameToUse} going to play first`
        )
      }
    }
  })

  // useRoom('win')

  return (
    <ul>
      {logs.map((log, index) => (
        <li key={index}>{log}</li>
      ))}
    </ul>
  )
}
