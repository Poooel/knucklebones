import { jsonResponse } from '../utils/jsonResponse'
import { randomName } from '../utils/randomName'
import Ably from 'ably/build/ably-webworker.min'

interface Env {
  ABLY_SERVER_SIDE_API_KEY: string
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context

  const client = new Ably.Rest.Promise(env.ABLY_SERVER_SIDE_API_KEY)

  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: randomName()
  })

  return jsonResponse(tokenRequestData, { status: 200 })
}
