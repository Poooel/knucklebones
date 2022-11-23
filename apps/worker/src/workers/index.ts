import { ThrowableRouter, missing, withParams } from 'itty-router-extras'
import { withDurables } from 'itty-durable'
import { createCors } from 'itty-cors'
import { displayName, init, play, rematch, webSocket } from '../endpoints'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'

export { GameStateDurableObject } from '../durable-objects/GameStateDurableObject'
export { WebSocketDurableObject } from '../durable-objects/WebSocketDurableObject'

const router = ThrowableRouter()

const { preflight, corsify } = createCors({})

router
  .all('*', withDurables({ parse: true }), preflight)

  .post('/:roomKey/:playerId/init', withParams, init)
  .post('/:roomKey/:playerId/play/:column/:dice', withParams, play)
  .post('/:roomKey/:playerId/rematch', withParams, rematch)
  .post('/:roomKey/:playerId/displayName/:displayName', withParams, displayName)

  .all('*', () => missing('Are you sure about that?'))

export default {
  async fetch(
    request: Request,
    cloudflareEnvironment: CloudflareEnvironment,
    context: ExecutionContext
  ) {
    if (isWebSocketEndpointCalled(request)) {
      return await webSocket(request, cloudflareEnvironment)
    }

    return await router
      .handle(request, cloudflareEnvironment, context)
      .then(corsify)
  }
}

function isWebSocketEndpointCalled(request: Request) {
  const webSocketEndpointRegex = /\/[a-zA-Z0-9-]+\/websocket/
  const pathname = new URL(request.url).pathname
  return webSocketEndpointRegex.test(pathname)
}
