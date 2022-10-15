import { CloudflareEnvironment } from '../types/cloudflareEnvironment'

export class WebSocketStore {
  sessions: Array<{ webSocket: WebSocket; quit: boolean }>
  state: DurableObjectState
  cloudflareEnvironment: CloudflareEnvironment

  constructor(
    state: DurableObjectState,
    cloudflareEnvironment: CloudflareEnvironment
  ) {
    this.state = state
    this.cloudflareEnvironment = cloudflareEnvironment
    this.sessions = []
  }

  async fetch(request: Request) {
    const url = new URL(request.url)

    switch (url.pathname) {
      case '/websocket': {
        if (request.headers.get('Upgrade') !== 'websocket') {
          return new Response(
            'Expected Upgrade header with websocket value but found nothing',
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
    webSocket.accept()

    const session = { webSocket, quit: false }

    this.sessions.push(session)

    webSocket.addEventListener('message', (message) => {
      try {
        if (session.quit) {
          webSocket.close(1011, 'WebSocket broken.')
        }

        this.broadcast(JSON.stringify(message.data))
      } catch (err) {
        console.error(err)
      }
    })

    const closeOrErrorHandler = () => {
      session.quit = true
      this.sessions = this.sessions.filter((member) => member !== session)
    }
    webSocket.addEventListener('close', closeOrErrorHandler)
    webSocket.addEventListener('error', closeOrErrorHandler)
  }

  broadcast(message: string) {
    this.sessions.forEach((session) => {
      session.webSocket.send(message)
    })
  }
}
