import { Env } from '../utils/env'
import { jsonResponse } from '../utils/jsonResponse'
import { Play } from '../requests/play'
import { GameState } from '../types/gameState'
import Base64 from 'crypto-js/enc-base64'
import hmacSHA256 from 'crypto-js/hmac-sha256'
import utf8 from 'crypto-js/enc-utf8'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context
  const body = await request.json<Play>()
  const gameState =
    (await env.GAME_STATE_STORE.get<GameState>(body.roomId, {
      type: 'json'
    })) ?? createEmptyGameState(body.roomId)

  gameState.columns[body.column].push(body.value)

  await env.GAME_STATE_STORE.put(body.roomId, JSON.stringify(gameState))

  await sendStateThroughAbly(gameState, env.ABLY_SERVER_SIDE_API_KEY)

  return jsonResponse(gameState, { status: 200 })
}

function createEmptyGameState(roomId: string): GameState {
  return {
    columns: [[], [], []],
    roomId,
    playerOneId: '',
    playerTwoId: ''
  }
}

async function sendStateThroughAbly(gameState: GameState, ablyKey: string) {
  const rawResponse = await fetch(
    `https://rest.ably.io/channels/knucklebones:${gameState.roomId}/messages`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${createAblyJWT(ablyKey)}`
      },
      body: JSON.stringify({
        name: 'game-state-update',
        data: gameState
      })
    }
  )
  const content = await rawResponse.json()
  console.log({ content })
}

function createAblyJWT(ablyKey: string) {
  const [name, key] = ablyKey.split(':')

  const header = {
    typ: 'JWT',
    alg: 'HS256',
    kid: name
  }

  const currentTime = Math.round(Date.now() / 1000)
  const claims = {
    iat: currentTime /* current time in seconds */,
    exp: currentTime + 3600 /* time of expiration in seconds */,
    'x-ably-capability': '{"*":["*"]}',
    'x-ably-clientId': 'cloudflare-worker'
  }
  const base64Header = b64(utf8.parse(JSON.stringify(header)))
  const base64Claims = b64(utf8.parse(JSON.stringify(claims)))

  const token = base64Header + '.' + base64Claims
  /* Apply the hash specified in the header */
  const signature = b64(hmacSHA256(token, key))
  const ablyJWT = token + '.' + signature
  return ablyJWT
}

function b64(token: string): string {
  let encode = Base64.stringify(token)
  encode = encode.replace(/\=+$/, '')
  encode = encode.replace(/\+/g, '-')
  encode = encode.replace(/\//g, '_')

  return encode
}
