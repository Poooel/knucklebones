import { jsonResponse } from '../utils/jsonResponse'
import { randomName } from '../utils/randomName'
import Ably from 'ably/build/ably-webworker.min'
import { Env } from '../utils/env'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, request } = context

  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get('clientId')

  const client = new Ably.Rest.Promise(env.ABLY_CLIENT_SIDE_API_KEY)

  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: clientId ?? randomName()
  })

  return jsonResponse(tokenRequestData, { status: 200 })
}
