import { CloudflareEnvironment } from '../types/cloudflareEnvironment'

export async function webSocket(
  request: Request,
  cloudflareEnvironment: CloudflareEnvironment
): Promise<Response> {
  const pathname = new URL(request.url).pathname
  // slice(1) removes leading slash
  // so no empty entries when splitting
  const roomKey = pathname.slice(1).split('/')[0]

  const id = cloudflareEnvironment.WEB_SOCKET_DURABLE_OBJECT.idFromName(roomKey)
  const webSocketStore = cloudflareEnvironment.WEB_SOCKET_DURABLE_OBJECT.get(id)

  return await webSocketStore.fetch('https://dummy-url/websocket', request)
}
