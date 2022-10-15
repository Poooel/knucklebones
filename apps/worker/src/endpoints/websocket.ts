import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { getRoomId } from '../utils/room'

export async function websocket(
  request: Request,
  cloudflareEnvironment: CloudflareEnvironment
): Promise<Response> {
  const pathname = new URL(request.url).pathname
  const roomKey = pathname.split('/').filter((x) => x)[0]
  const roomId = getRoomId(roomKey)

  const id = cloudflareEnvironment.WEB_SOCKET_STORE.idFromName(roomId)
  const webSocketStore = cloudflareEnvironment.WEB_SOCKET_STORE.get(id)

  const newUrl = new URL(request.url)
  newUrl.pathname = '/websocket'

  console.log('sent to durable object web socket')

  const response = await webSocketStore.fetch(newUrl.toString(), request)

  console.log('response code', response.statusText)

  return response
}
