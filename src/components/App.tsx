import * as React from 'react'
import { Board, useBoard } from './Board'
import { configureAbly, useChannel, usePresence } from '@ably-labs/react-hooks'

interface Play {
  column: number
  value: number
}

// Not needed
function getRandomValue(min = 0, max = 1) {
  return Math.round(Math.random() * (max - min) + min)
}
function getRandomDice() {
  return getRandomValue(1, 6)
}

const clientId = localStorage.getItem('clientId')

configureAbly({
  authUrl: `/api/auth${clientId !== null ? `?clientId=${clientId}` : ''}`
})

export function App() {
  const isItMe = (clientId: string) => {
    return clientId === ably.auth.clientId
  }

  const [dice, setDice] = React.useState(getRandomDice())
  const [nextMove, setNextMove] = React.useState<Play | null>(null)

  const { columns: opponentColumns, addToColumn: addToOpponentColumn } =
    useBoard()

  const { columns, addToColumn } = useBoard({
    onDicePlaced(column, value) {
      // Because of strict mode, publishes two events in dev
      setNextMove({
        column,
        value
      })
      setMyTurn(false)
      setDice(getRandomDice())
    }
  })

  const [channel, ably] = useChannel(
    'knucklebones:test',
    ({ clientId, data }) => {
      if (!isItMe(clientId)) {
        addToOpponentColumn(data.column, data.value)
        setMyTurn(true)
      }
    }
  )

  const [myTurn, setMyTurn] = React.useState(true)

  React.useEffect(() => {
    if (ably.auth.clientId !== undefined) {
      channel.history((err, result) => {
        if (err != null) {
          console.error(err)
        }

        if (result !== undefined) {
          result.items.forEach((item) => {
            if (isItMe(item.clientId)) {
              addToColumn(item.data.column, item.data.value, false)
            } else {
              addToOpponentColumn(item.data.column, item.data.value, false)
            }
          })

          const lastPlayerClientId = result?.items[0].clientId
          setMyTurn(!isItMe(lastPlayerClientId))
        }
      })
    }
  }, [ably.auth.clientId])

  React.useEffect(() => {
    if (nextMove !== null) {
      channel.publish('play', nextMove)
    }
  }, [channel, nextMove])

  const [name, setName] = React.useState<string | null>(null)
  const [opponentName, setOpponentName] = React.useState<string | null>(null)
  const [presenceData] = usePresence('knucklebones:test')

  React.useEffect(() => {
    setName(null)
    setOpponentName(null)

    presenceData.forEach(({ clientId }) => {
      if (isItMe(clientId)) {
        setName(clientId)
      } else {
        setOpponentName(clientId)
      }
    })
  }, [presenceData])

  React.useEffect(() => {
    if (ably.auth.clientId !== undefined) {
      localStorage.setItem('clientId', ably.auth.clientId)
    }
  }, [ably.auth.clientId])

  return (
    <div className='flex h-screen flex-col items-center justify-between p-6'>
      {/* Disclaimer on landscape mode to avoid implementing difficult and useless design */}
      <div className='absolute inset-0 hidden h-screen bg-black/25 landscape:block lg:landscape:hidden'>
        <div className='flex h-full flex-row items-center justify-center'>
          {/* Could be using `dialog` with `backdrop:` but doesn't seem to work atm */}
          <div className='rounded bg-white p-4'>
            <p>This game has been thought for portrait mode only</p>
          </div>
        </div>
      </div>
      <Board isOpponentBoard columns={opponentColumns} name={opponentName} />
      <Board
        columns={columns}
        onColumnClick={(colIndex) => addToColumn(colIndex, dice)}
        nextDie={dice}
        canPlay={myTurn}
        name={name}
      />
    </div>
  )
}
