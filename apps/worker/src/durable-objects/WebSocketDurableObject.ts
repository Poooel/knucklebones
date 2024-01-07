import { type CloudflareEnvironment } from '../types/cloudflareEnvironment'

export class WebSocketDurableObject {
  state: DurableObjectState
  cloudflareEnvironment: CloudflareEnvironment

  constructor(
    state: DurableObjectState,
    cloudflareEnvironment: CloudflareEnvironment
  ) {
    this.state = state
    this.cloudflareEnvironment = cloudflareEnvironment
  }

  async fetch(request: Request) {
    const url = new URL(request.url)

    switch (url.pathname) {
      case '/websocket': {
        if (request.headers.get('Upgrade') !== 'websocket') {
          return new Response(
            'Expected Upgrade header with webSocket value but found nothing',
            { status: 400 }
          )
        }

        const [client, server] = Object.values(new WebSocketPair())

        await this.handleSession(server)

        return new Response(null, { status: 101, webSocket: client })
      }
      case '/broadcast': {
        this.broadcast(await request.text())
        return new Response(null, { status: 200 })
      }
      default:
        return new Response('Not found', { status: 404 })
    }
  }

  async handleSession(webSocket: WebSocket) {
    this.state.acceptWebSocket(webSocket)
  }

  async webSocketMessage(webSocket: WebSocket, message: string | ArrayBuffer) {
    try {
      this.broadcast(JSON.stringify(message))
    } catch (error) {
      console.error(error)
    }
  }

  async webSocketClose(
    webSocket: WebSocket,
    code: number,
    reason: string,
    wasClean: boolean
  ) {
    await this.closeOrErrorHandler(webSocket)
  }

  async webSocketError(webSocket: WebSocket, error: any) {
    console.error(error)
    await this.closeOrErrorHandler(webSocket)
  }

  async closeOrErrorHandler(webSocket: WebSocket) {}

  broadcast(message: string) {
    this.state.getWebSockets().forEach((webSocket) => {
      try {
        webSocket.send(message)
      } catch (error) {
        console.error(error)
      }
    })
  }
}
