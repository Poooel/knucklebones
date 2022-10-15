import Ably from 'ably/build/ably-webworker.min'
import { json } from 'itty-router-extras'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { RequestWithProps } from '../types/itty'
import { randomName } from '../utils/randomName'

export async function auth(
  request: RequestWithProps,
  cloudflareEnvironment: CloudflareEnvironment
): Promise<Response> {
  const clientId = request.playerId ?? randomName()

  const client = new Ably.Rest.Promise(
    cloudflareEnvironment.ABLY_CLIENT_SIDE_API_KEY
  )

  const tokenRequestData = await client.auth.createTokenRequest({
    clientId
  })

  return json(tokenRequestData)
}
