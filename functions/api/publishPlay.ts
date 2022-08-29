import { jsonResponse } from '../utils/jsonResponse'
import Ably from 'ably/build/ably-webworker.min'
import { Env } from '../utils/env'
import { PublishPlayBody } from '../utils/publishPlayType'

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { env, request } = context

    console.log('shotgun #1')

    const body: PublishPlayBody = await request.json()

    console.log('shotgun #2')

    const client = new Ably.Rest.Promise(env.ABLY_SERVER_SIDE_API_KEY)

    console.log('shotgun #3')

    const channel = client.channels.get(body.room)

    console.log('shotgun #4')

    await channel.publish('play', 'test')

    console.log('shotgun #5')

    return jsonResponse({}, { status: 200 })
  } catch (e) {
    console.log({ e })
    return new Response('error', { status: 500 })
  }
}
