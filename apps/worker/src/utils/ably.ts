import Base64 from 'crypto-js/enc-base64'
import hmacSHA256 from 'crypto-js/hmac-sha256'
import utf8 from 'crypto-js/enc-utf8'
import { GameState } from '@knucklebones/common'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'

type WordArray = ReturnType<typeof utf8.parse>

export async function sendStateThroughAbly(
  gameState: GameState,
  cloudflareEnvironment: CloudflareEnvironment,
  roomId: string
) {
  const ablyJWT = await getAblyJWT(cloudflareEnvironment)

  await fetch(`https://rest.ably.io/channels/${roomId}/messages`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ablyJWT}`
    },
    body: JSON.stringify({
      name: 'game-state-update',
      data: gameState
    })
  })
}

async function getAblyJWT(cloudflareEnvironment: CloudflareEnvironment) {
  let ablyJWT = await cloudflareEnvironment.ABLY_JWT_STORE.get('ablyJWT')

  if (ablyJWT === null) {
    ablyJWT = createAblyJWT(cloudflareEnvironment.ABLY_SERVER_SIDE_API_KEY)
    await cloudflareEnvironment.ABLY_JWT_STORE.put('ablyJWT', ablyJWT, {
      expirationTtl: 3600
    })
  }

  return ablyJWT
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

function b64(token: WordArray): string {
  let encode = Base64.stringify(token)
  encode = encode.replace(/\=+$/, '')
  encode = encode.replace(/\+/g, '-')
  encode = encode.replace(/\//g, '_')

  return encode
}
