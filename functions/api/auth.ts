import { jsonResponse } from '../utils/jsonResponse'
import { randomName } from '../utils/randomName'
import Ably from 'ably/build/ably-webworker.min'
import { Env } from '../types/env'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, request } = context

  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get('clientId')

  if (env.ABLY_CLIENT_SIDE_API_KEY === undefined) {
    throw new Error(
      '`ABLY_CLIENT_SIDE_API_KEY` is not defined. Make sure it is available via the `.dev.vars` file locally, or it is defined in the CloudFlare environment variables.'
    )
  }
  const client = new Ably.Rest.Promise(env.ABLY_CLIENT_SIDE_API_KEY)

  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: clientId ?? randomName()
  })

  return jsonResponse(tokenRequestData, { status: 200 })
}
